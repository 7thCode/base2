/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router: any = express.Router();

// const event = module.parent.exports.event;
const event: any = require.main.exports.event;

// const logger: any = module.parent.exports.logger;
const logger: any = require.main.exports.logger;

// const ConfigModule: any = module.parent.exports.config;
const ConfigModule: any = require.main.exports.config;

const gatekeeper: any = require("../../base/library/gatekeeper");
const Auth: any = require("../../../../server/platform/modules/auth/controller");
const auth: any = new Auth(event, ConfigModule, logger);

const Mailer: any = require("./controller");
const mailer: any = new Mailer(event, ConfigModule, logger);

/*
*
*/
router.get("/mailer/auth/query/:name/:option", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_manager(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			mailer.query(request, response);
		});
	}]);

/*
*
*/
router.post("/mailer/auth", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			mailer.send(request, response);
		});
	}]);

/*
*
*/
router.get("/mailer/auth/:name/:UID", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			mailer.get(request, response);
		});
	}]);

/*
*
*/
router.delete("/mailer/auth/:name/:UID", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			mailer.delete(request, response);
		});
	}]);

/*
*
*/
router.put("/mailer/auth/addflags/:name/:UID", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			mailer.addFlags(request, response);
		});
	}]);

/*
*
*/
router.put("/mailer/auth/removeflags/:name/:UID", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object, next: any): void => {
		auth.is_own_by_id(request, response, next);
	},
	(request: any, response: object): void => {
		logger.trace(request.url);
		gatekeeper.catch(response, () => {
			mailer.removeFlags(request, response);
		});
	}]);

module.exports = router;
