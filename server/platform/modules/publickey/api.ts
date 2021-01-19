/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router: any = express.Router();

const event: any = require.main.exports.event;
const config: any = require.main.exports.config;
const logger: any = require.main.exports.logger;

const gatekeeper: any = require("../../base/library/gatekeeper");

const PublicKey: any = require("./controller");
const publickey: any = new PublicKey(event, config, logger);

router.get("/publickey/fixed", [gatekeeper.default,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			publickey.get_fixed_public_key(request, response);
		});
	}]);

router.get("/publickey/dynamic", [gatekeeper.default, gatekeeper.authenticate,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			publickey.get_public_key(request, response);
		});
	}]);

router.get("/publickey/token", [gatekeeper.default, gatekeeper.authenticate,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			publickey.get_access_token(request, response);
		});
	}]);

module.exports = router;
