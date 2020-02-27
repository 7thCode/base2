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

const event = module.parent.exports.event;
const logger: any = module.parent.exports.logger;
const config: any = module.parent.exports.config;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const Vaults: any = require("./controller");
const vaults: any = new Vaults(event, config, logger);

router.get("/vaults/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			vaults.query(request, response);
		});
	}]);

router.get("/vaults/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			vaults.count(request, response);
		});
	}]);

router.get("/vaults/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			vaults.get(request, response);
		});
	}]);

router.post("/vaults/auth", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			vaults.post(request, response);
		});
	}]);

router.put("/vaults/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			vaults.put(request, response);
		});
	}]);

router.delete("/vaults/auth/:id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			vaults.delete(request, response);
		});
	}]);

module.exports = router;
