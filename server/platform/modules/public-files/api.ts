/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router = express.Router();

const event: any = require.main.exports.event;
const logger: any = require.main.exports.logger;

const gatekeeper: any = require("../../base/library/gatekeeper");

const ConfigModule: any = require.main.exports.config;

const systemsConfig: any = ConfigModule.systems;

const connection: any = require.main.exports.connection;

const PublicFiles: any = require("./controller");
const publicFiles: any = new PublicFiles(event, ConfigModule, logger, connection);

publicFiles.init(systemsConfig.initpublicfiles, (error: IErrorObject, result: any): void => {
	if (!error) {

		router.get("/pfiles/auth/query/:query/:option", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					publicFiles.queryFiles(request, response);
				});
			},
		]);

		router.get("/pfiles/auth/count/:query", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					publicFiles.countFiles(request, response);
				});
			},
		]);

		router.get("/pfiles/auth/*", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					publicFiles.getFile(request, response);
				});
			},
		]);
		/*
				router.post("/pfiles/auth/*", [gatekeeper.default, gatekeeper.authenticate,
					(request: any, response: object): void => {
						logger.trace(request.url);
						gatekeeper.catch(response, (): void => {
							publicFiles.postFile(request, response);
						});
					},
				]);

				router.delete("/pfiles/auth/*", [gatekeeper.default, gatekeeper.authenticate,
					(request: any, response: object): void => {
						logger.trace(request.url);
						gatekeeper.catch(response, (): void => {
							publicFiles.deleteFile(request, response);
						});
					},
				]);
		*/
		router.get("/pfiles/get/*", [gatekeeper.default,
			(request: any, response: any, next: () => void): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					publicFiles.renderFile(request, response, next);
				});
			}]);

		router.get("/pfiles/getid/:id", [gatekeeper.default,
			(request: any, response: any, next: () => void): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					publicFiles.renderId(request, response, next);
				});
			}]);

	} else {
		logger.fatal("init error.", error.message);
		process.exit(1);
	}
});

module.exports = router;
