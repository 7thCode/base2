/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IVaultModel} from "../../../../types/platform/server";

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;

const SecureUpdatable: any = require(path.join(controllers, "secure_updatable_controller"));
const Vault: any = require(path.join(models, "platform/vaults/vault"));

/**
 *
 */
export class Vaults extends SecureUpdatable {

	/**
	 *
	 */
	protected Model: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 */
	constructor(event: object, config: object, logger: object) {
		super(event, config, logger);
		this.Model = Vault as IVaultModel;
	}

}

module.exports = Vaults;
