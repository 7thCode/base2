/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const event = module.parent.exports.event;
const logger: any = module.parent.exports.logger;
const ConfigModule: any = module.parent.exports.config;

const usersConfig: any = require(path.join(_config, "default")).users;
const gatekeeper: any = require(path.join(library, "gatekeeper"));

const Sites: any = require("./controller");
const sites: any = new Sites(event, ConfigModule, logger);

sites.init(usersConfig.initarticles, (error: IErrorObject, result: any): void => {
	if (!error) {

		router.get("/sites/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
			gatekeeper.catch(response, () => {
				sites.query(request, response);
			});
		}]);

		router.get("/sites/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
			gatekeeper.catch(response, () => {
				sites.count(request, response);
			});
		}]);

		router.get("/sites/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: {params: {id: string}}, response: object): void => {
			gatekeeper.catch(response, () => {
				sites.get(request, response);
			});
		}]);

		router.post("/sites/auth", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
			gatekeeper.catch(response, () => {
				sites.post(request, response);
			});
		}]);

		router.put("/sites/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: {params: {id: string}}, response: object): void => {
			gatekeeper.catch(response, () => {
				sites.put(request, response);
			});
		}]);

		router.delete("/sites/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: {params: {id: string}}, response: object): void => {
			gatekeeper.catch(response, () => {
				sites.delete(request, response);
			});
		}]);

	} else {
		console.error("init error. (article) " + error.message);
		logger.fatal("init error. (article) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
