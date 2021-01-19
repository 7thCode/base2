/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router = express.Router();

const event : any = require.main.exports.event;
const logger: any = require.main.exports.logger;
const config: any = require.main.exports.config;

const gatekeeper: any = require("../../base/library/gatekeeper");

const Session: any = require("./controller");
const session: any = new Session(event, config, logger);

router.get("/session/auth", [gatekeeper.default,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			session.get(request, response);
		});
	}]);

router.put("/session/auth", [gatekeeper.default, gatekeeper.authenticate,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			session.put(request, response);
		});
	}]);

module.exports = router;
