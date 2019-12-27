/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const modules: string = global._modules;
const library: string = global._library;
const _config: string = global.__config;

const gatekeeper: any = require(path.join(library, "gatekeeper"));
const Auth: any = require(path.join(modules, "auth/controller"));
const auth: any = new Auth(module.parent.exports.event);

const Account: any = require("./controller");
const accounts: any = new Account(module.parent.exports.event);

router.get("/accounts/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.query(request, response);
		});
	}]);

router.get("/accounts/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.count(request, response);
		});
	}]);

router.get("/accounts/auth/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.get(request, response);
		});
	}]);

router.put("/accounts/auth/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.put(request, response);
		});
	}]);

router.delete("/accounts/auth/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.delete(request, response);
		});
	}]);

router.get("/accounts/auth/is2fa/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.get_is_secret(request, response);
		});
	}]);

router.post("/accounts/auth/set2fa/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.post_set_secret(request, response);
		});
	}]);

router.post("/accounts/auth/reset2fa/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own(request, response, next);
	},
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			accounts.post_reset_secret(request, response);
		});
	}]);

module.exports = router;
