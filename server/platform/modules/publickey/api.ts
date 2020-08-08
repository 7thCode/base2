/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const project_root: string = process.cwd();
const library: string = path.join(project_root, "server/platform/base/library");

const event = module.parent.exports.event;
const config: any = module.parent.exports.config;
const logger: any = module.parent.exports.logger;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const PublicKey: any = require("./controller");
const publickey: any = new PublicKey(event, config, logger);

router.get("/publickey/fixed", [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			publickey.get_fixed_public_key(request, response);
		});
	}]);

router.get("/publickey/dynamic", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			publickey.get_public_key(request, response);
		});
	}]);

router.get("/publickey/token", [gatekeeper.default, gatekeeper.authenticate,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			publickey.get_access_token(request, response);
		});
	}]);

module.exports = router;
