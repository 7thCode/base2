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

const Files: any = require("./controller");
const file: any = new Files(event, ConfigModule, logger, connection);

file.init(systemsConfig.initfiles, (error: IErrorObject, result: any): void => {
	if (!error) {

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
					file.postFile(request, response);
				});
			},
		]);

		router.delete("/files/auth/*", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					file.deleteFile(request, response);
				});
			},
		]);

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

	} else {
		logger.fatal("init error. (files) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
