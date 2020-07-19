/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../../types/platform/server";
import {AuthLevel, IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router = express.Router();

const path: any = require("path");
const fs: any = require("graceful-fs");

const library: string = global._library;

const event = module.parent.exports.event;

const logger: any = module.parent.exports.logger;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const ConfigModule: any = module.parent.exports.config;
const systemsConfig: any = ConfigModule.systems;

const Files: any = require("./controller");
const file: any = new Files(event, ConfigModule, logger);

const cache_root: string = "files/cache/";

file.init(systemsConfig.initfiles, (error: IErrorObject, result: any): void => {
	if (!error) {

		const cache_write = (user_id: string, _path: string, input: any, callback: (error) => void): void => {
			try {
				const cache_file: string = path.join(process.cwd(), "public", cache_root, user_id, _path);
				const cache_dir: string = path.dirname(cache_file);
				fs.mkdir(cache_dir, {recursive: true}, (error) => {
					if (!error) {
						const dest = fs.createWriteStream(cache_file);
						input.pipe(dest);
					}
					callback(error);
				});
			} catch (error) {
				callback(error);
			}
		};

		const cache_delete = (user_id: string, _path: string, callback: (error) => void): void => {
			try {
				const cache_file: string = path.join(process.cwd(), "public", cache_root, user_id, _path);
				fs.unlink(cache_file, (error) => {
					callback(error);
				});
			} catch (error) {
				callback(error);
			}
		};

		router.get("/files/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					file.queryFiles(request, response);
				});
			},
		]);

		router.get("/files/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					file.countFiles(request, response);
				});
			},
		]);

		router.get("/files/auth/*", [gatekeeper.default,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					file.getFile(request, response);
				});
			},
		]);

		router.post("/files/auth/*", [gatekeeper.default, gatekeeper.authenticate,
			(request: { user: { user_id: string }, params: string[] }, response: object): void => {
				const path: string = request.params[0];
				const user_id = request.user.user_id;
				cache_delete(user_id, path, (error) => {
					gatekeeper.catch(response, (): void => {
						file.postFile(request, response);
					});
				});
			},
		]);

		router.delete("/files/auth/*", [gatekeeper.default, gatekeeper.authenticate,
			(request: { user: { user_id: string }, params: string[] }, response: object): void => {
				const path: string = request.params[0];
				const user_id = request.user.user_id;
				cache_delete(user_id, path, (error) => {
					gatekeeper.catch(response, (): void => {
						file.deleteFile(request, response);
					});
				});
			},
		]);

		const render = (response: any, next: () => void, result: any, file: any, query: any, range: string, command_string: string, callback: (result: any) => void): void => {

			let command: string = command_string;

			const mimetype: string = result.metadata.type;
			const total: number = result.length;

			let status: number = 200;

			let start: number = 0;
			let end: number = 0;
			let chunksize: number = 0;

			/*
			* HTTP/1.1： 範囲要請
			* RFC 7233, Range Requests
			* https://triple-underscore.github.io/RFC7233-ja.html
			 */
			if (range) {　    // with [Range Request] for Large Stream seeking. (ex Video,Sound...)
				command = "";

				const parts: string[] = range.replace(/bytes=/, "").split("-");
				const partialstart: string = parts[0];
				const partialend: string = parts[1];

				status = 206;	// Partial Content
				start = partialstart ? parseInt(partialstart, 10) : 0;
				end = partialend ? parseInt(partialend, 10) : total - 1;
			} else { 			// Full Data.
				status = 200;	// Full Content
				start = 0;
				end = total - 1;
			}

			chunksize = (end - start) + 1;

			file.getPartial(result._id, start, end, (error: IErrorObject, result: any): void => {
				if (!error) {
					if (result) {
						response.status(status);
						response.type(mimetype);
						response.set("Content-Range", "bytes " + start + "-" + end + "/" + total);
						response.set("Accept-Ranges", "bytes");
						response.set("Content-Length", chunksize);

						// c=[{"c":"resize","p":{"width":300,"height":100}}]
						file.effect(mimetype, query, command, result, (error: any, result: any): void => {
							if (!error) {
								result.pipe(response);
								callback(result);
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

		const render_id = (response: any, next: () => void, file: any, _id: string, query: any, range: string, command_string: string, callback: (result: any) => void): void => {
			file.getRecordById(_id, (error: IErrorObject, result: any): void => {
				if (!error) {
					if (result) {
						if (result.metadata.rights.read === AuthLevel.public) {
							render(response, next, result, file, query, range, command_string, callback);
						} else {
							response.status(403).render("error", {message: "Forbidden...", status: 403});
						}
					} else {
						next();
					}
				} else {
					file.brankImage((error: IErrorObject, result: any, item: any): void => {
						if (!error) {
							// const mimetype = item.metadata.type;
							const mimetype: string = "image/png";
							const total: number = item.length;
							const start: number = 0;
							const end: number = total - 1;
							const chunksize: number = (end - start) + 1;

							response.status(200);
							response.type(mimetype);
							response.set("Content-Range", "bytes " + start + "-" + end + "/" + total);
							response.set("Accept-Ranges", "bytes");
							response.set("Content-Length", chunksize);

							result.pipe(response);
							callback(result);
						} else {
							next();
						}
					});
				}
			});
		};

		const render_file = (response: any, next: () => void, file: any, user_id: string, path: string, query: any, range: string, command_string: string, callback: (result: any) => void): void => {
			file.getRecord(user_id, path, (error: IErrorObject, result: any): void => {
				if (!error) {
					if (result) {
						if (result.metadata.rights.read === AuthLevel.public) {
							render(response, next, result, file, query, range, command_string, callback);
						} else {
							response.status(403).render("error", {message: "Forbidden...", status: 403});
						}
					} else {
						next();
					}
				} else {
					file.brankImage((error: IErrorObject, result: any, item: any): void => {
						if (!error) {
							// const mimetype = item.metadata.type;
							const mimetype: string = "image/png";
							const total: number = item.length;
							const start: number = 0;
							const end: number = total - 1;
							const chunksize: number = (end - start) + 1;

							response.status(200);
							response.type(mimetype);
							response.set("Content-Range", "bytes " + start + "-" + end + "/" + total);
							response.set("Accept-Ranges", "bytes");
							response.set("Content-Length", chunksize);

							result.pipe(response);
							callback(result);
						} else {
							next();
						}
					});
				}
			});
		};

		router.get("/files/get/*", [gatekeeper.default, (request: { params: string[], query: { u: string, c: string }, user: object, headers: { range: string } }, response: any, next: () => void): void => {
			gatekeeper.catch(response, (): void => {

				const path: string = request.params[0];
				const query: { u: string, c: string } = request.query;
				const user: IAccountModel = file.Transform(request.user);
				const systems: any = systemsConfig.default;

				let user_id: string = query.u || systems.user_id;
				if (user) {
					user_id = query.u || user.user_id || systems.user_id;
				}

				const range: string = request.headers.range;
				const command_string: string = query.c || "";

				render_file(response, next, file, user_id, path, query, range, command_string, (result) => {

				});
			});
		}]);

		router.get("/files/getid/:id", [gatekeeper.default, (request: { params: any, query: { u: string, c: string }, user: object, headers: { range: string } }, response: any, next: () => void): void => {
			gatekeeper.catch(response, (): void => {
				const _id = request.params.id;
				const query: { u: string, c: string } = request.query;

				const range: string = request.headers.range;
				const command_string: string = query.c || "";

				render_id(response, next, file, _id, query, range, command_string, (result) => {

				});

			});
		}]);

		router.get("/" + cache_root + ":user_id/*", [gatekeeper.default, (request: { params: any, query: { u: string, c: string }, user: object, headers: { range: string } }, response: any, next: () => void): void => {
			gatekeeper.catch(response, (): void => {

				const params = request.params;
				const path: string = params[0];
				const user_id: string = params.user_id;
				const query: { u: string, c: string } = request.query;

				const range: string = request.headers.range;
				const command_string: string = query.c || "";

				render_file(response, next, file, user_id, path, query, range, command_string, (result) => {
					cache_write(user_id, path, result, () => {

					});
				});
			});
		}]);
	} else {
		console.error("init error. (files) " + error.message);
		logger.fatal("init error. (files) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
