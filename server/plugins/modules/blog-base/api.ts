/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router: any = express.Router();

const event: any = require.main.exports.event;
const logger: any = require.main.exports.logger;
const ConfigModule: any = require.main.exports.config;

const usersConfig: any = ConfigModule.users;

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const Entries: any = require("./controller");
const entries: any = new Entries(event, ConfigModule, logger);

entries.init(usersConfig.initentries, (error: IErrorObject, result: any): void => {
	if (!error) {


		router.get("/robots.txt", (request: any, response: any) => {
			gatekeeper.catch(response, () => {
				entries.robots(request, response);
			});
		});

		router.get("/sitemap.xml", (request: any, response: any) => {
			gatekeeper.catch(response, () => {
				entries.sitemap(request, response);
			});
		});

		router.get("/entries/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.query(request, response);
				});
			}]);

		router.get("/entries/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.count(request, response);
				});
			}]);

		router.get("/entries/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.get(request, response);
				});
			}]);

		router.post("/entries/auth", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.post(request, response);
				});
			}]);

		router.put("/entries/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.put(request, response);
				});
			}]);

		router.delete("/entries/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.delete(request, response);
				});
			}]);

		router.get("/entries/auth/month/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.group_by_month(request, response);
				});
			}]);

		router.get("/entries/auth/type/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, () => {
					entries.group_by_type(request, response);
				});
			}]);

	} else {
		logger.fatal("init error. (entries) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
