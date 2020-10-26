/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router: any = express.Router();

const event = module.parent.exports.event;

const logger: any = module.parent.exports.logger;

const ConfigModule: any = module.parent.exports.config;
const systemsConfig: any = ConfigModule.systems;
const modules = systemsConfig.modules;
const nativefiles = modules["native-files"];
const initfiles = nativefiles.initfiles;

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const NativeFiles: any = require("./controller");
const nativeFiles: any = new NativeFiles(event, ConfigModule, logger);

nativeFiles.init(initfiles, (error: IErrorObject, result: any): void => {
	if (!error) {

		router.get("/nativefiles/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					nativeFiles.query(request, response);
				});
			}]);

		router.get("/nativefiles/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					nativeFiles.count(request, response);
				});
			}]);

		router.get("/nativefiles/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					nativeFiles.get(request, response);
				});
			}]);

		router.post("/nativefiles/auth", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					nativeFiles.post(request, response);
				});
			}]);

		router.put("/nativefiles/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					nativeFiles.put(request, response);
				});
			}]);

		router.delete("/nativefiles/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					nativeFiles.delete(request, response);
				});
			}]);

	} else {
		logger.fatal("init error. (nativefiles) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
