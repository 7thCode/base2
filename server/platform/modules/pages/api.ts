/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";
import {ajaxGet} from "rxjs/internal-compatibility";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const library: string = global._library;

const event = module.parent.exports.event;

const logger: any = module.parent.exports.logger;

const ConfigModule: any = module.parent.exports.config;
const systemsConfig: any = ConfigModule.systems;
const usersConfig: any = ConfigModule.users;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const Pages: any = require("./controller");
const pages: any = new Pages(event, ConfigModule, logger);

// initialize

pages.init(usersConfig.initpages, (error: IErrorObject, result: any): void => {
	if (!error) {

		router.get("/pages/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					pages.query(request, response);
				});
			}]);

		router.get("/pages/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					pages.count(request, response);
				});
			}]);

		router.get("/pages/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					pages.get(request, response);
				});
			}]);

		router.post("/pages/auth", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					pages.post(request, response);
				});
			}]);

		router.put("/pages/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					pages.put(request, response);
				});
			}]);

		router.delete("/pages/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, () => {
					pages.delete(request, response);
				});
			}]);

		router.get("/pages/get/*", [gatekeeper.default,(request: { params: string[], query: { u: string, t: string }, user: object }, response: object, next: () => void): void => {
			gatekeeper.catch(response, () => {
				const path: any = request.params[0];
				const query: { u: string, t: string } = request.query;
				const user: IAccountModel = pages.Transform(request.user);
				const systems: any = systemsConfig.default;

				let user_id: string = query.u || systems.user_id;
				if (user) {
					user_id = query.u || user.user_id || systems.user_id;
				}

				const enverope = (error: any, result: any, response: any): void => {
					if (!error) {
						if (result) {
							pages.SendSuccess(response, result);
						} else {
							pages.SendError(response, {code: -1, message: "(page 1)"});
						}
					} else {
						pages.SendError(response, error);
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
				pages.getPage(user_id, path, object, (error: IErrorObject, result: string, mimetype: string): void => {
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
		console.error("init error. (pages) " + error.message);
		logger.fatal("init error. (pages) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
