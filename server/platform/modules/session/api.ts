/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router = express.Router();

const event = module.parent.exports.event;
const logger: any = module.parent.exports.logger;
const config: any = module.parent.exports.config;

const gatekeeper: any = require("../../base/library/gatekeeper");

const Session: any = require("./controller");
const session: any = new Session(event, config, logger);

router.get("/session/auth", [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			session.get(request, response);
		});
	}]);

router.put("/session/auth", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			session.put(request, response);
		});
	}]);

module.exports = router;
