/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router: any = express.Router();

const event = module.parent.exports.event;

const logger: any = module.parent.exports.logger;

const ConfigModule: any = module.parent.exports.config;

const gatekeeper: any = require("../../base/library/gatekeeper");
const Auth: any = require("../../../../server/platform/modules/auth/controller");
const auth: any = new Auth(event, ConfigModule, logger);

const Account: any = require("./controller");
const accounts: any = new Account(event, ConfigModule, logger);

/*
*
*/
router.get("/accounts/auth/query/:query/:option", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.query(request, response);
		});
	}]);

/*
*
*/
router.get("/accounts/auth/count/:query", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.count(request, response);
		});
	}]);

/*
*
*/
router.get("/accounts/auth/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.get(request, response);
		});
	}]);

/*
*
*/
router.put("/accounts/auth/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.put(request, response);
		});
	}]);

/*
*
*/
router.get("/accounts/auth", [gatekeeper.default, gatekeeper.authenticate,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.get_self(request, response);
		});
	}]);

/*
*
*/
router.put("/accounts/auth", [gatekeeper.default, gatekeeper.authenticate,
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.put_self(request, response);
		});
	}]);

/*
*
*/
router.delete("/accounts/auth/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.delete(request, response);
		});
	}]);

/*
*
*/
router.get("/accounts/auth/is2fa/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.get_is_secret(request, response);
		});
	}]);

/*
*
*/
router.post("/accounts/auth/set2fa/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_name(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.post_set_secret(request, response);
		});
	}]);

/*
*
*/
router.post("/accounts/auth/reset2fa/:username", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_name(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.post_reset_secret(request, response);
		});
	}]);

/*
*
*/
router.get("/accounts/id/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.get_by_id(request, response);
		});
	}]);

/*
*
*/
router.put("/accounts/id/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.put_by_id(request, response);
		});
	}]);

/*
*
*/
router.delete("/accounts/id/:user_id", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			accounts.delete_by_id(request, response);
		});
	}]);

module.exports = router;
