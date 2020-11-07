/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

// https://stripe.com/docs/api/idempotent_requests

const express: any = require("express");
export const router = express.Router();

const event : any = require.main.exports.event;
const logger: any = require.main.exports.logger;
const config: any = require.main.exports.config;

// const event: any = module.parent.exports.event;
// const logger: any = module.parent.exports.logger;
// const config: any = module.parent.exports.config;

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const Paypal: any = require("./controller");
const paypal: any = new Paypal(event, config, logger);


module.exports = router;
