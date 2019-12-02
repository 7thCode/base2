/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router = express.Router();

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const Session: any = require("./controller");
const session: any = new Session(module.parent.exports.event);

router.get("/session/auth", [gatekeeper.guard,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			session.get(request, response);
		});
	}]);

router.put("/session/auth", [gatekeeper.guard, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			session.put(request, response);
		});
	}]);

module.exports = router;
