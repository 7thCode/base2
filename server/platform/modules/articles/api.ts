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
const usersConfig: any = ConfigModule.users;

const gatekeeper: any = require("../../base/library/gatekeeper");

const Articles: any = require("./controller");
const articles: any = new Articles(event, ConfigModule, logger);

articles.init(usersConfig.initarticles, (error: IErrorObject, result: any): void => {
	if (!error) {

		router.get("/articles/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					articles.query(request, response);
				});
			}]);

		router.get("/articles/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					articles.count(request, response);
				});
			}]);

		router.get("/articles/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: { params: { id: string } }, response: object): void => {
				gatekeeper.catch(response, () => {
					articles.get(request, response);
				});
			}]);

		router.post("/articles/auth", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					articles.post(request, response);
				});
			}]);

		router.put("/articles/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: { params: { id: string } }, response: object): void => {
				gatekeeper.catch(response, () => {
					articles.put(request, response);
				});
			}]);

		router.delete("/articles/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: { params: { id: string } }, response: object): void => {
				gatekeeper.catch(response, () => {
					articles.delete(request, response);
				});
			}]);

	} else {
		console.error("init error. (article) " + error.message);
		logger.fatal("init error. (article) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
