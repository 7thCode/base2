/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router = express.Router();

const path: any = require("path");
const fs: any = require("graceful-fs");

const project_root = path.join(__dirname, "../../../..");

const event: any = module.parent.exports.event;

const logger: any = module.parent.exports.logger;

const gatekeeper: any = require("../../base/library/gatekeeper");

const ConfigModule: any = module.parent.exports.config;
const systemsConfig: any = ConfigModule.systems;

const Files: any = require("./controller");
const file: any = new Files(event, ConfigModule, logger);

const cache_root: string = "files/cache/";

file.init(systemsConfig.initfiles, (error: IErrorObject, result: any): void => {
	if (!error) {

		const cache_write = (user_id: string, _path: string, input: any, callback: (error: IErrorObject) => void): void => {
			try {
				const cache_file: string = path.join(project_root, "public", cache_root, user_id, _path);
				const cache_dir: string = path.dirname(cache_file);
				fs.mkdir(cache_dir, {recursive: true}, (error: IErrorObject) => {
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

		const cache_delete = (user_id: string, _path: string, callback: (error: IErrorObject) => void): void => {
			try {
				const cache_file: string = path.join(project_root, "public", cache_root, user_id, _path);
				fs.unlink(cache_file, (error: IErrorObject) => {
					callback(error);
				});
			} catch (error) {
				callback(error);
			}
		};

		router.get("/files/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.queryFiles(request, response);
				});
			},
		]);

		router.get("/files/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.countFiles(request, response);
				});
			},
		]);

		router.get("/files/auth/*", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.getFile(request, response);
				});
			},
		]);

		router.post("/files/auth/*", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					// 		const path: string = request.params[0];
					// 		const user_id = request.user.user_id;
					// 		cache_delete(user_id, path, (error) => {
					file.postFile(request, response);
					// 		});
				});
			},
		]);

		router.delete("/files/auth/*", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					// 		const path: string = request.params[0];
					// 		const user_id = request.user.user_id;
					// 		cache_delete(user_id, path, (error) => {
					file.deleteFile(request, response);
					// 		});
				});
			},
		]);

		router.get("/images/*", [gatekeeper.default,
			(request: any, response: any, next: () => void): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.renderFile(request, response, next);
				});
			}]);

		router.get("/files/get/*", [gatekeeper.default,
			(request: any, response: any, next: () => void): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.renderFile(request, response, next);
				});
			}]);

		router.get("/files/getid/:id", [gatekeeper.default,
			(request: any, response: any, next: () => void): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.renderId(request, response, next);
				});
			}]);

	// 	router.get("/" + cache_root + ":user_id/*", [gatekeeper.default,
	// 		(request: any, response: any, next: () => void): void => {
	// 			logger.trace(request.url);
	// 			gatekeeper.catch(response, (): void => {
	// 				file.renderFile(request, response, next);
	// 			});
	// 		}]);

	} else {
		logger.fatal("init error. (files) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
