/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel, IDeleteFile, IGetFile, IJSONResponse, IPostFile, IQueryRequest} from "../../../../types/platform/server";
import {AuthLevel, Callback, IErrorObject, IQueryOption} from "../../../../types/platform/universe";
import {Errors} from "../../../platform/base/library/errors";

const Mongoose = require('mongoose');
const fs: any = require("graceful-fs");
const mongodb: any = require("mongodb");

const path: any = require("path");

const project_root: string = path.join(__dirname, "../../../..");

interface IRenderParam {
	u: string;
	c: string;
	w: string;
	h: string;
}


const Files: any = require("../../../platform/modules/files/controller");

/*
*
*
*
*/
export class PublicFiles extends Files {

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @param db_connections
	 */
	constructor(event: any, config: any, logger: any, db_connections: any) {
		super(event, config, logger, db_connections);
	}

	/**
	 * query_by_user_read
	 *
	 * User restriction query by read.
	 *
	 * @param query
	 * @param user
	 * @param default_user
	 * @returns nonequery_by_user_read
	 */
	protected static query_by_user_read(user: { username: string, auth: number }, default_user: { username: string }, query: object): object {
		return query;
	}

	/**
	 * query_by_user_write
	 *
	 * User restriction query by update.
	 *
	 * @param query
	 * @param user
	 * @param default_user
	 * @returns none
	 */
	protected static query_by_user_write(user: { username: string, auth: number }, default_user: { username: string }, query: object): object {
		return query;
	}

	/**
	 * fromLocal
	 *
	 * insert local file into db.
	 *
	 * @param pathFrom
	 * @param user
	 * @param name
	 * @param category
	 * @param description
	 * @param mimetype
	 * @param callback
	 * @returns none
	 */
	private fromLocal(pathFrom: string, user: { username: string, auth: number }, name: string, category: string, description: string, mimetype: string, callback: Callback<any>): void {
		try {
			const writestream: any = this.gfs.openUploadStream(name,
				{
					metadata: {
						username: user.username,
						relations: {},
						rights: {read: user.auth, write: user.auth},
						type: mimetype,
						category,
						description,
					},
				},
			);

			const readstream: any = fs.createReadStream(pathFrom + "/" + name, {encoding: null, bufferSize: 1});

			readstream.on("error", (error: IErrorObject): void => {
				callback(error, null);
			});

			writestream.once("finish", (file: object): void => {
				callback(null, file);
			});

			writestream.on("error", (error: IErrorObject): void => {
				callback(error, null);
			});

			readstream.pipe(writestream);

		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 * result_public_file
	 *
	 * public file
	 *
	 * @param name
	 * @param callback
	 * @returns none
	 */
	private result_public_file(name: string, callback: (error: IErrorObject, stream: object, length: number) => void): void {
		this.collection.findOne({filename: name}, (error: IErrorObject, item: any): void => {
			if (!error) {
				if (item) {
					const readstream: any = this.gfs.openDownloadStream(item._id);
					callback(null, readstream, item.length);
				} else {
					callback(Errors.generalError(1, "not found.", "S00178"), null, null);
				}
			} else {
				callback(error, null, null);
			}
		});
	}

	/**
	 * insert_file
	 *
	 * insert file
	 *
	 * @param request
	 * @param user
	 * @param name
	 * @param rights
	 * @param category
	 * @param description
	 * @param callback
	 * @returns none
	 */
	private insert_file(request: IPostFile, user: { username: string, auth: number }, name: string, rights: { read: number, write: number }, category: string, description: string, callback: Callback<any>): void {

		const parseDataURL: any = (dataURL: string): any => {
			const result: any = {mediaType: null, encoding: null, isBase64: null, data: null};
			if (/^data:([^;]+)(;charset=([^,;]+))?(;base64)?,(.*)/.test(dataURL)) {
				result.mediaType = RegExp.$1 || "text/plain";
				result.encoding = RegExp.$3 || "US-ASCII";
				result.isBase64 = String(RegExp.$4) === ";base64";
				result.data = RegExp.$5;
			}
			return result;
		};

		const info: any = parseDataURL(request.body.url);
		if (info.data) {
			const chunk: any = info.isBase64 ? Buffer.from(info.data, "base64") : Buffer.from(unescape(info.data), "binary");
			if (chunk) {
				const writestream: any = this.gfs.openUploadStream(name,
					{
						metadata: {
							username: user.username,
							relations: {},
							rights,  // {read: user.auth, write: user.auth},
							type: Files.to_mime(request),
							count: 0,
							category,
							description,
						},
					},
				);

				if (writestream) {
					writestream.once("finish", (file: any): void => {
						callback(null, file);
					});
					writestream.write(chunk);
					writestream.end();
				} else {
					callback(Errors.generalError(42, "stream not open.", "S00179"), null);
				}
			} else {
				callback(Errors.generalError(41, "no chunk.", "S00180"), null);
			}
		} else {
			callback(Errors.generalError(40, "no data.", "S00181"), null);
		}
	}

	/**
	 *
	 * get
	 *
	 * @param username
	 * @param name
	 * @param callback
	 * @returns none
	 */
	private get_record(username: string, name: string, callback: Callback<any>): void {
		try {
			const query: object = PublicFiles.query_by_user_read({username, auth: AuthLevel.public}, this.default_user, {filename: name});
			this.collection.findOne(query).then((item: object): void => {
				if (item) {
					callback(null, item);
				} else {
					callback(Errors.generalError(1, "no item", "S00182"), null);
				}
			}).catch((error: IErrorObject) => {
				callback(error, null);
			});
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 *
	 *
	 * @param _id
	 * @param callback
	 * @returns none
	 */
	private get_record_by_id(_id: string, callback: Callback<any>): void {
		try {
			const id: any = new mongodb.ObjectId(_id);
			this.collection.findOne({_id: id}).then((item: object): void => {
				if (item) {
					callback(null, item);
				} else {
					callback(Errors.generalError(1, "no item", "S00183"), null);
				}
			}).catch((error: IErrorObject) => {
				callback(error, null);
			});
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 *
	 *
	 * @param _id
	 * @param start
	 * @param end
	 * @param callback
	 * @returns none
	 */
	private get_partial(_id: string, start: number, end: number, callback: Callback<any>): void {
		try {
			const readstream: object = this.gfs.openDownloadStream(_id, {start, end: end + 1});
			if (readstream) {
				callback(null, readstream);
			} else {
				callback(Errors.generalError(1, "stream not found.", "S00184"), null);
			}
		} catch (e) {
			callback(e, null);
		}
	}

	/*
	*
	* response
	*
	* @param response
	* @param next
	* @param data
	* @param query
	* @param range
	* @param command_string
	*/
	private render(response: any, next: () => void, data: any, range: string, param: IRenderParam): void {

		const command_string: string = param.c || "";
		const mimetype: string = data.metadata.type;
		const total: number = data.length;

		let command: string = "";
		let status: number = 200;
		let start: number = 0;
		let end: number = 0;

		/*
		* HTTP/1.1： 範囲要請
		* RFC 7233, Range Requests
		* https://triple-underscore.github.io/RFC7233-ja.html
		 */
		if (range) {    // with [Range Request] for Large Stream seeking. (ex Video,Sound...)
			command = ""; // Because, in partial transfer, the effect cannot be used.
			const target_range: { start: number, end: number } = Files.parse_range(range, total);
			status = 206;
			start = target_range.start;
			end = target_range.end;
		} else { 			// Full Data.
			command = command_string;
			status = 200;
			start = 0;
			end = total - 1;
		}

		this.get_partial(data._id, start, end, (error: IErrorObject, result: any): void => {
			if (!error) {
				if (result) {
					Files.set_header(response, status, mimetype, start, end, total);
					// c=[{"c":"resize","p":{"width":300,"height":100}}]
					this.effect(mimetype, param, command, result, (error: any, result: any): void => {
						if (!error) {
							result.pipe(response);
							// 				callback(result);
						} else {
							next();
						}
					});
				} else {
					next();
				}
			} else {
				next();
			}
		});
	};

	/*
	*
	* get files by username and file path
	*
	* @param response
	* @param next
	* @param username
	* @param path
	* @param query
	* @param range
	* @param command_string
	*
	*/
	private render_by_file(response: any, next: () => void, username: string, path: string, param: IRenderParam, range: string): void {
		this.get_record(username, path, (error: IErrorObject, data: any): void => {
			if (!error) {
				if (data) {
					this.render(response, next, data, range, param);
				} else {
					next();
				}
			} else {
				this.render_blank(response, next);
			}
		});
	};

	/*
	* render_by_id
	*
	* get files by id
	*
	* @param response
	* @param next
	* @param id
	* @param query
	* @param range
	* @param command_string
	*/
	private render_by_id(response: any, next: () => void, _id: string, param: IRenderParam, range: string): void {
		this.get_record_by_id(_id, (error: IErrorObject, data: any): void => {
			if (!error) {
				if (data) {
					this.render(response, next, data, range, param);
				} else {
					next();
				}
			} else {
				this.render_blank(response, next);
			}
		});
	};

	/**
	 *
	 * @param initfiles
	 * @param callback
	 * @returns none
	 */
	public init(initfiles: any[], callback: Callback<any>): void {
		try {
			const db: any = this.connection.db;
			this.collection = db.collection("fs.files");
			this.gfs = new Mongoose.mongo.GridFSBucket(db);
			if (initfiles) {
				if (initfiles.length > 0) {
					// ensureIndex
					this.collection.createIndex({
						"filename": 1,
						"metadata.username": 1,
					}).then(() => {
						const promises: Promise<any>[] = [];
						initfiles.forEach((doc) => {
							promises.push(new Promise((resolve: any, reject: any): void => {
								const path: string = project_root + doc.path;
								const filename: string = doc.name;
								const user: { username: string, auth: number } = doc.user;
								const mimetype: string = doc.content.type;
								const category: string = doc.content.category;
								const description: string = doc.content.description;
								// const type: number = doc.type;
								const query: object = {filename};

								this.collection.findOne(query).then((item: object): void => {
									if (!item) {
										this.fromLocal(path, user, filename, category, description, mimetype, (error: IErrorObject, file: any): void => {
											if (!error) {
												resolve(file);
											} else {
												reject(error);
											}
										});
									} else {
										resolve(item);
									}
								}).catch((error: IErrorObject) => {
									reject(error);
								});
							}));
						})

						Promise.all(promises).then((objects): void => {
							callback(null, objects);
						}).catch((error): void => {
							callback(error, null);
						});
					}).catch((error: IErrorObject): void => {
						callback(error, null);
					});
				} else {
					callback(null, null);
				}
			} else {
				callback(null, null);
			}
		} catch (e: any) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public queryFiles(request: IQueryRequest, response: IJSONResponse): void {
		try {
			this.Decode(request.params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					this.Decode(request.params.option, (error: IErrorObject, option: IQueryOption): void => {
						this.ifSuccess(response, error, (): void => {
							const operator: IAccountModel = this.Transform(request.user);
							this.collection.find(PublicFiles.query_by_user_read(operator, this.default_user, query), option).limit(option.limit).skip(option.skip).toArray().then((docs: any): void => {
								this.SendRaw(response, docs);
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S00185"));
							});
						});
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00186"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public countFiles(request: IQueryRequest, response: IJSONResponse): void {
		try {
			this.Decode(request.params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					const operator: IAccountModel = this.Transform(request.user);
					// const auth: number = user.auth;
					this.collection.find(PublicFiles.query_by_user_read(operator, this.default_user, query)).count().then((count: number): void => {
						this.SendSuccess(response, count);
					}).catch((error: IErrorObject) => {
						this.SendError(response, Errors.Exception(error, "S00187"));
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00188"));
		}
	}

	/**
	 * getFile
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public getFile(request: IGetFile, response: IJSONResponse): void {
		try {
			const path: string = request.params[0];
			const operator: IAccountModel = this.Transform(request.user);

			const BinaryToBase64: any = (str: string): any => {
				return Buffer.from(str, "binary").toString("base64");
			};
			const query: object = PublicFiles.query_by_user_read(operator, this.default_user, {filename: path});
			this.collection.findOne(query).then((item: { _id: object, metadata: { type: string } }): void => {
				if (item) {
					let buffer: Buffer = Buffer.alloc(0);
					const readstream: any = this.gfs.openDownloadStream(item._id);
					if (readstream) {
						readstream.on("data", (chunk: any): void => {
							buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
						});
						readstream.on("end", (): void => {
							const dataurl: string = "data:" + item.metadata.type + ";base64," + BinaryToBase64(buffer);
							this.SendSuccess(response, dataurl);
						});
						readstream.on("error", (error: IErrorObject): void => {
							this.SendError(response, Errors.Exception(error, "S00189"));
						});
					} else {
						this.SendError(response, Errors.generalError(2, "no stream.(file 1)", "S00190"));
					}
				} else {
					this.SendError(response, Errors.generalError(1, "no item.(file 1)", "S00191"));
				}
			}).catch((error: IErrorObject) => {
				this.SendError(response, Errors.Exception(error, "S00192"));
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00193"));
		}
	}

	/**
	 * postFile
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public postFile(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00194"), request.user, () => {
				this.ifExist(response, Errors.generalError(1, "no content.", "S00195"), request.body.url, () => {
					const path: string = request.params[0];
					const category: string = request.body.category;
					const description: string = request.body.description;
					const params: { upsert: boolean } = request.body.params;
					const operator: IAccountModel = this.Transform(request.user);
					const rights = {read: AuthLevel.public, write: AuthLevel.user};

					if (path) {
						const query: object = PublicFiles.query_by_user_write(operator, this.default_user, {filename: path});
						this.collection.findOne(query).then((item: object): void => {
							if (!item) { // new.
								this.insert_file(request, operator, path, rights, category, description, (error: IErrorObject, result: object): void => {
									this.ifSuccess(response, error, (): void => {
										this.SendSuccess(response, result);
									});
								});
							} else { // if already this then swap.
								if (params.upsert) {
									this.collection.deleteOne(query).then((): void => {
										this.insert_file(request, operator, path, rights, category, description, (error: IErrorObject, result: object): void => {
											this.ifSuccess(response, error, (): void => {
												this.SendSuccess(response, result);
											});
										});
									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S00196"));
									});
								} else {
									this.SendError(response, Errors.generalError(1, "alrady exist.", "S00197"));
								}
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00198"));
						});
					} else {
						this.SendError(response, Errors.generalError(1, "no name.", "S00199"));
					}
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00200"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public deleteFile(request: IDeleteFile, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(-1, "not logged in.", "000201"), request.user, () => {
				const path: string = request.params[0];
				const operator: IAccountModel = this.Transform(request.user);

				const query: object = PublicFiles.query_by_user_write(operator, this.default_user, {filename: path});
				this.collection.findOneAndDelete(query).then((): void => {
					this.SendSuccess(response, {});
				}).catch((error: IErrorObject) => {
					this.SendError(response, Errors.Exception(error, "S00202"));
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00203"));
		}
	}

	public renderFile(request: any, response: any, next: any): void {

		const path: string = request.params[0];  // Because FilePath contains "/".
		const range: string = request.headers.range;

		const param: IRenderParam = request.query;
		const user: IAccountModel = this.Transform(request.user);

		const _default: any = this.config.systems.default;

		let username: string = _default.username;

		if (!username) {
			if (user) {
				username = user.username;
			}
		}

		if (param.u) {
			username = param.u;
		}

		this.render_by_file(response, next, username, path, param, range);
	}

	public renderId(request: any, response: any, next: any): void {
		const _id = request.params.id;
		const range: string = request.headers.range;

		const param: IRenderParam = request.query;

		// 	const command_string: string = param.c || "";

		this.render_by_id(response, next, _id, param, range);
	}

}

module.exports = PublicFiles;
