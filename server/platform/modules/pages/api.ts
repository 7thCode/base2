/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";
import {Errors} from "../../base/library/errors";

const express: any = require("express");
export const router: any = express.Router();

const event: any = require.main.exports.event;
const logger: any = require.main.exports.logger;
const ConfigModule: any = require.main.exports.config;

const systemsConfig: any = ConfigModule.systems;
const usersConfig: any = ConfigModule.users;

const gatekeeper: any = require("../../base/library/gatekeeper");

const Pages: any = require("./controller");
const pages: any = new Pages(event, ConfigModule, logger);

// initialize

pages.init(usersConfig.initpages, (error: IErrorObject, result: any): void => {
	if (!error) {

		router.get("/pages/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate, gatekeeper.enabled,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					pages.query(request, response);
				});
			}]);

		router.get("/pages/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate, gatekeeper.enabled,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					pages.count(request, response);
				});
			}]);

		router.get("/pages/auth/:id", [gatekeeper.default, gatekeeper.authenticate, gatekeeper.enabled,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					pages.get(request, response);
				});
			}]);

		router.post("/pages/auth", [gatekeeper.default, gatekeeper.authenticate, gatekeeper.enabled,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					pages.post(request, response);
				});
			}]);

		router.put("/pages/auth/:id", [gatekeeper.default, gatekeeper.authenticate, gatekeeper.enabled,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					pages.put(request, response);
				});
			}]);

		router.delete("/pages/auth/:id", [gatekeeper.default, gatekeeper.authenticate, gatekeeper.enabled,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					pages.delete(request, response);
				});
			}]);

		router.get("/pages/get/*", [gatekeeper.default,
			(request: any, response: object, next: () => void): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					const path: any = request.params[0];
					const query: { u: string, t: string } = request.query;
					const user: IAccountModel = pages.Transform(request.user);
					const _default: any = systemsConfig.default;

					let username: string = query.u || _default.username;
					if (user) {
						username = query.u || user.username || _default.username;
					}

					const enverope = (error: any, result: any, response: any): void => {
						if (!error) {
							if (result) {
								pages.SendSuccess(response, result);
							} else {
								pages.SendError(response, Errors.userError(1, "(page 1)", "S00204"));
							}
						} else {
							next();
							// 					pages.SendError(response, Errors.serverError(error,"3345"));
						}
					};

					const page = (error: any, result: any, response: any, mimetype: string, next: () => void): void => {
						if (!error) {
							if (result) {
								response.setHeader("Content-Type", mimetype);
								response.send(result);
							} else {
								next();
							}
						} else {
							next();
						}
					};

					// value query....
					const object = {result: "example..."};
					// ?t=e - enveroped. result using for API.
					pages.getPage(username, path, object, (error: IErrorObject, result: string, mimetype: string): void => {
						if (query.t) {
							switch (query.t) {
								case "e":		 // for API(....?t=e)
									enverope(error, result, response);
									break;
								default: // for Browser
									page(error, result, response, mimetype, next);
							}
						} else { // for Browser
							page(error, result, response, mimetype, next);
						}
					});
				});
			}]);

	} else {
		logger.fatal("init error. (pages) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
