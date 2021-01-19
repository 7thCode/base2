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

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const Paypal: any = require("./controller");
const paypal: any = new Paypal(event, config, logger);

module.exports = router;
