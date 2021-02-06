/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

// https://stripe.com/docs/api/idempotent_requests

import {IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router = express.Router();

const event : any = require.main.exports.event;
const logger: any = require.main.exports.logger;
const config: any = require.main.exports.config;

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const ExtServices: any = require("./controller");
const ext_services: any = new ExtServices(event, config, logger);

router.get('/ext/zip/address/:zip', [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			ext_services.zip_to_address(request, response);
		});
	}])

module.exports = router;
