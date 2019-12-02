/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

// import {Promise} from "es6-promise";
import {IAccountModel, IDeleteFile, IGetFile, IJSONResponse, IPostFile, IQueryRequest} from "../../../../types/server";
import {AuthLevel, Callback, IErrorObject, IQueryOption} from "../../../../types/universe";
import {Auth} from "../auth/controller";

const _: any = require("lodash");
const fs: any = require("graceful-fs");
const sharp: any = require("sharp");
const mongodb: any = require("mongodb");
const MongoClient: any = require("mongodb").MongoClient;

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const log4js: any = require("log4js");
log4js.configure(path.join(_config, "platform/logs.json"));
const logger: any = log4js.getLogger("request");

const config = require(path.join(_config, "default")).systems;
const Wrapper: any = require(path.join(controllers, "wrapper"));

export class Files extends Wrapper {

	private db: any;
	private gfs: any;
	private collection: any;

	constructor(event: object) {
		super(event);
	}

	private static toMime(request: {body: {url: string}}): string {
		let type: string = "image/octet-stream";
		const index: number = request.body.url.indexOf(";");
		if (index > 0) {
			const types: string[] = request.body.url.substring(0, index).split(":");
			if (types.length === 2) {
				type = types[1];
			}
		}
		return type;
	}

	private static connect(): any {
		const options: object = {
			keepAlive: 1,
			connectTimeoutMS: 1000000,
			reconnectTries: 30,
			reconnectInterval: 2000,
			useNewUrlParser: true,
		};
		let connectUrl = "mongodb://" + config.db.user + ":" + config.db.password + "@" + config.db.address + "/" + config.db.name;
		if (config.db.noauth) {
			connectUrl = "mongodb://" + config.db.address + "/" + config.db.name;
		}
		return MongoClient.connect(connectUrl, options);
	}

	private fromLocal(pathFrom: string, user: {user_id: string, role: {raw: number}}, name: string, category: string, description: string, mimetype: string, callback: Callback<any>): void {
		try {
			const writestream: any = this.gfs.openUploadStream(name,
				{
					metadata: {
						user_id: user.user_id,
						group: "",
						rights: {read: user.role.raw, write: user.role.raw},
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

	private resultFile(gfs: any, collection: any, user_id: string, name: string, callback: (error: IErrorObject, result: object, type: string) => void): void {
		collection.findOne({$and: [{filename: name}, {"metadata.user_id": user_id}]}, (error: IErrorObject, item: any): void => {
			if (!error) {
				if (item) {
					const readstream: any = gfs.openDownloadStream(item._id);
					callback(null, readstream, item);
				} else {
					callback({code: -1, message: "not found."}, null, "");
				}
			} else {
				callback(error, null, "");
			}
		});
	}

	private insertFile(request: IPostFile, user: {user_id: string, role: {raw: number}}, name: string, rights: {read: number, write: number} , category: string, description: string, callback: Callback<any>): void {

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
							user_id: user.user_id,
							group: "",
							rights: rights,  // {read: user.role.raw, write: user.role.raw},
							type: Files.toMime(request),
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
					callback({code: 42, message: "stream not open"}, null);
				}
			} else {
				callback({code: 41, message: "no chunk"}, null);
			}
		} else {
			callback({code: 40, message: "no data"}, null);
		}
	}

	/**
	 *
	 * @returns none
	 */
	public init(initfiles: any[], callback: Callback<any>): void {
		try {
			Files.connect().then((client): void => {
				this.db = client.db(config.db.name);
				this.db.collection("fs.files", (error: IErrorObject, collection: object): void => {
					this.gfs = new mongodb.GridFSBucket(this.db, {});
					this.collection = collection;

					if (initfiles) {
						if (initfiles.length > 0) {
							// ensureIndex
							this.collection.createIndex({
								"filename": 1,
								"metadata.user_id": 1,
							}, (error) => {
								if (!error) {
									const save = (doc: any): Promise<any> => {
										return new Promise((resolve: any, reject: any): void => {
											const path: string = process.cwd() + doc.path;
											const filename: string = doc.name;
											const user: {user_id: string, role: {raw: number}} = doc.user;
											const mimetype: string = doc.content.type;
											const category: string = doc.content.category;
											const description: string = "";
											const type: number = doc.type;
											const query: object = {filename};

											this.collection.findOne(query, (error: IErrorObject, item: object): void => {
												if (!error) {
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
												} else {
													reject(error);
												}
											});
										});
									};

									const docs: object[] = initfiles;
									Promise.all(docs.map((doc: any): any => {
										return save(doc);
									})).then((results: any[]): void => {
										callback(null, results);
									}).catch((error: IErrorObject): void => {
										callback(error, null);
									});
								}
							});
						} else {
							callback(null, null);
						}
					}
				});
			}).catch((error): void => {
				logger.info("mongo connection error: " + error);
			});
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param query
	 * @param user
	 * @returns none
	 */
	private static query_by_user_read(user: {user_id: string, auth: number}, query: object): object {
		return {$and: [{$or: [{"metadata.user_id": {$eq: user.user_id}}, {"metadata.rights.read": {$gte: user.auth}}]}, query]};
		// return {$and: [{user_id: user.user_id}, query]};
	}

	/**
	 *
	 * @param query
	 * @param user
	 * @returns none
	 */
	private static query_by_user_write(user: {user_id: string, auth: number}, query: object): object {
		return {$and: [{$or: [{"metadata.user_id": {$eq: user.user_id}}, {"metadata.rights.write": {$gte: user.auth}}]}, query]};
		// return {$and: [{user_id: user.user_id}, query]};
	}

	/**
	 *
	 * @param user_id
	 * @param name
	 * @param callback
	 * @returns none
	 */
	public getRecord(user_id: string, name: string, callback: Callback<any>): void {
		try {
			const query: object = Files.query_by_user_read({user_id, auth: 100000}, {filename: name});
			this.collection.findOne(query, (error: IErrorObject, item: object): void => {
				if (!error) {
					if (item) {
						callback(null, item);
					} else {
						callback({code: -1, message: "no item"}, null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param _id
	 * @param start
	 * @param end
	 * @param callback
	 * @returns none
	 */
	public getPartial(_id: string, start: number, end: number, callback: Callback<any>): void {
		try {
			const readstream: object = this.gfs.openDownloadStream(_id, {start, end: end + 1});
			if (readstream) {
				callback(null, readstream);
			} else {
				callback({code: -1, message: "stream not found."}, null);
			}
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param callback
	 * @returns none
	 */
	public brankImage(callback: (error: IErrorObject, result: object, item: string) => void): void {
		try {
			// NOT FOUND IMAGE.
			this.resultFile(this.gfs, this.collection, config.default.user_id, "blank.png", (error, readstream, type: string) => {
				// 	item.metadata.type
				callback(null, readstream, type);
			});
		} catch (e) {
			callback(e, null, null);
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
							const user: IAccountModel = this.Transform(request.user);
							this.collection.find(Files.query_by_user_read(user, query), option).limit(option.limit).skip(option.skip).toArray((error: IErrorObject, docs: any): void => {
								this.ifSuccess(response, error, (): void => {
									this.SendRaw(response, docs);
								});
							});
						});
					});
				});
			});
		} catch (e) {
			this.SendFatal(response, e);
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
					const user: IAccountModel = this.Transform(request.user);
					// const auth: number = user.auth;
					this.collection.find(Files.query_by_user_read(user, query)).count((error: IErrorObject, count: number): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, count);
						});
					});
				});
			});
		} catch (e) {
			this.SendFatal(response, e);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public getFile(request: IGetFile, response: IJSONResponse): void {
		try {
			// const name: string = request.params.name;
			const path: string = request.params[0];
			const user: IAccountModel = this.Transform(request.user);

			const BinaryToBase64: any = (str: string): any => {
				return Buffer.from(str, "binary").toString("base64");
			};

			const query: object = Files.query_by_user_read(user, {filename: path});
			this.collection.findOne(query, (error: IErrorObject, item: {_id: object, metadata: {type: string}}): void => {
				this.ifSuccess(response, error, (): void => {
					if (item) {
						let buffer: Buffer = Buffer.alloc(0);
						const readstream: any = this.gfs.openDownloadStream(item._id);
						if (readstream) {
							readstream.on("data", (chunk): void => {
								buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
							});
							readstream.on("end", (): void => {
								const dataurl: string = "data:" + item.metadata.type + ";base64," + BinaryToBase64(buffer);
								this.SendSuccess(response, dataurl);
							});
							readstream.on("error", (error: IErrorObject): void => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 2, message: "no stream"});
						}
					} else {
						this.SendError(response, {code: 1, message: "no item"});
					}
				});
			});
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public postFile(request: IPostFile, response: IJSONResponse): void {
		try {
			const path: string = request.params[0];
			const category: string = request.body.category;
			const user: IAccountModel = this.Transform(request.user);
			const rights = {read: AuthLevel.public, write: AuthLevel.user};
			const description: string = "";

			if (path) {
				const query: object = Files.query_by_user_write(user, {filename: path});
				this.collection.findOne(query, (error: IErrorObject, item: object): void => {
					this.ifSuccess(response, error, (): void => {
						if (!item) {
							this.insertFile(request, user, path, rights, category, description, (error: IErrorObject, result: object): void => {
								this.ifSuccess(response, error, (): void => {
									this.SendSuccess(response, result);
								});
							});
						} else {
							this.collection.deleteOne(query, (error: IErrorObject): void => {
								this.ifSuccess(response, error, (): void => {
									this.insertFile(request, user, path, rights, category, description, (error: IErrorObject, result: object): void => {
										this.ifSuccess(response, error, (): void => {
											this.SendSuccess(response, result);
										});
									});
								});
							});
						}
					});
				});
			} else {
				this.SendWarn(response, {code: 1, message: "no name"});
			}
		} catch (e) {
			this.SendFatal(response, e);
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
			const path: string = request.params[0];
			const user: IAccountModel = this.Transform(request.user);

			const query: object = Files.query_by_user_write(user, {filename: path});
			this.collection.findOne(query, (error: IErrorObject, item: object): void => {
				this.ifSuccess(response, error, (): void => {
					if (item) {
						this.collection.deleteOne(query, (error): void => {
							this.ifSuccess(response, error, (): void => {
								this.SendSuccess(response, {});
							});
						});
					} else {
						this.SendWarn(response, {code: 1, message: "not found"});
					}
				});
			});
		} catch (e) {
			this.SendFatal(response, e);
		}
	}

	/**
	 *
	 * @param mimetype ex. "image/jpeg"...
	 * @param query
	 * @param command  ex. [{"c":"resize","p":{"width":300,"height":100}}]
	 * @param stream
	 * @param callback
	 * @returns none
	 */
	public effect(mimetype: string, query: { w: string, h: string }, command: string, stream: any, callback: Callback<any>): void {
		switch (mimetype) {
			case "image/jpeg":
			case "image/jpg":
			case "image/png":
			case "image/webp":
				if (command) { // image effect
					try {
						const commands: any[] = JSON.parse(command);
						if (Array.isArray(commands)) {
							commands.forEach((command) => {
								const parameter = command.p;
								switch (command.c) {
									case "resize": {
										stream = this.resize(parameter, stream);
										break;
									}
									case "extend": {
										stream = this.extend(parameter, stream);
										break;
									}
									case "extract": {
										stream = this.extract(parameter, stream);
										break;
									}
									case "trim": {
										break;
									}
									case "rotate": {
										stream = this.rotate(parameter, stream);
										break;
									}
									case "flip": {
										stream = this.flip(parameter, stream);
										break;
									}
									case "flop": {
										stream = this.flop(parameter, stream);
										break;
									}
									case "sharpen": {
										stream = this.sharpen(parameter, stream);
										break;
									}
									case "median": {
										stream = this.median(parameter, stream);
										break;
									}
									case "blur": {
										stream = this.blur(parameter, stream);
										break;
									}
									case "flatten": {
										stream = this.flatten(parameter, stream);
										break;
									}
									case "gamma": {
										stream = this.gamma(parameter, stream);
										break;
									}
									case "negate": {
										stream = this.negate(parameter, stream);
										break;
									}
									case "normalise": {
										stream = this.normalise(parameter, stream);
										break;
									}
									case "threshold": {
										stream = this.threshold(parameter, stream);
										break;
									}
									case "boolean": {
										stream = this.boolean(parameter, stream);
										break;
									}
									case "linear": {
										stream = this.linear(parameter, stream);
										break;
									}
									case "recomb": {
										stream = this.recomb(parameter, stream);
										break;
									}
									case "tint": {
										stream = this.tint(parameter, stream);
										break;
									}
									case "greyscale": {
										stream = this.greyscale(parameter, stream);
										break;
									}
									default:
								}
							});
						} else {
							callback({code: -1, message: "invalid command."}, stream);
						}
					} finally {
						callback(null, stream);
					}
				} else { // shorthand
					try {
						const width: number = parseInt(query.w, 10);
						const height: number = parseInt(query.h, 10);
						if (width || height) {
							stream = this.resize({width, height}, stream);
						}
					} finally {
						callback(null, stream);
					}
				}
				break;
			default:
				callback(null, stream);
		}
	}

	// {"c":"resize","p":{"width":100,"height":100}};
	public resize(parameter, result): object {
		const resizer: object = sharp().resize(parameter);
		return result.pipe(resizer);
	}

	// {"c":"extend","p":{"top":100,"bottom":200,"left":100,"right":100,"background":{"r":100,"g":100,"b":0,"alpha":1}}}
	public extend(parameter, result): object {
		const resizer: object = sharp().extend(parameter);
		return result.pipe(resizer);
	}

	//  {"c": "extract", "p":{ "left": 50, "top": 10, "width": 30, "height": 40 }}
	public extract(parameter, result): object {
		const resizer: object = sharp().extract(parameter);
		return result.pipe(resizer);
	}

	// {"c": "rotate", "p": { "angle": 45}};
	public rotate(parameter, result): object {
		const angle = parameter.angle || 90;
		const resizer: object = sharp().rotate(angle);
		return result.pipe(resizer);
	}

	// {"c": "flip", "p": {}};
	public flip(parameter, result): object {
		const resizer: object = sharp().flip();
		return result.pipe(resizer);
	}

	// {"c": "flop", "p": {}};
	public flop(parameter, result): object {
		const resizer: object = sharp().flop();
		return result.pipe(resizer);
	}

	// {"c": "sharpen", "p": {"sigma":1.2}};
	public sharpen(parameter, result): object {
		const sigma: number = parameter.sigma || 10;
		const resizer: object = sharp().sharpen(Math.min(1000, Math.max(sigma, 0.3)));
		return result.pipe(resizer);
	}

	// {"c": "median", "p": {"size":10}};
	public median(parameter, result): object {
		const size: number = parameter.size || 3;
		const resizer: object = sharp().median(size);
		return result.pipe(resizer);
	}

	// {"c": "blur", "p": {"sigma":1.2}};
	public blur(parameter, result): object {
		const sigma: number = parameter.sigma || 10;
		const resizer: object = sharp().blur(Math.min(1000, Math.max(sigma, 0.3)));
		return result.pipe(resizer);
	}

	public flatten(parameter, result): object {
		const resizer: object = sharp().flatten(parameter);
		return result.pipe(resizer);
	}

	public gamma(parameter, result): object {
		const resizer: object = sharp().gamma(parameter);
		return result.pipe(resizer);
	}

	public negate(parameter, result): object {
		const resizer: object = sharp().negate(parameter);
		return result.pipe(resizer);
	}

	public normalise(parameter, result): object {
		const resizer: object = sharp().normalise(parameter);
		return result.pipe(resizer);
	}

	public threshold(parameter, result): object {
		const resizer: object = sharp().threshold(parameter);
		return result.pipe(resizer);
	}

	public boolean(parameter, result): object {
		const resizer: object = sharp().boolean(parameter);
		return result.pipe(resizer);
	}

	public linear(parameter, result): object {
		const resizer: object = sharp().linear(parameter);
		return result.pipe(resizer);
	}

	public recomb(parameter, result): object {
		const resizer: object = sharp().recomb(parameter);
		return result.pipe(resizer);
	}

	public tint(parameter, result): object {
		const resizer: object = sharp().tint(parameter);
		return result.pipe(resizer);
	}

	public greyscale(parameter, result): object {
		const resizer: object = sharp().greyscale(parameter);
		return result.pipe(resizer);
	}

}

module.exports = Files;
