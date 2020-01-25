/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const ConfigModule: any = require(path.join(_config, "default"));
const config: any = ConfigModule.systems;

const Wrapper: any = require(path.join(controllers, "wrapper"));
const Cipher: any = require(path.join(library, "cipher"));

/**
 *
 */
export class PublicKey extends Wrapper {

	/**
	 *
	 * @param event
	 */
	constructor(event: object) {
		super(event);
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	public get_fixed_public_key(request: object, response: IJSONResponse): void {
		if (config.use_publickey) {
			this.SendSuccess(response, config.publickey);
		} else {
			this.SendSuccess(response, null);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	public get_public_key(request: { user: { publickey: string } }, response: IJSONResponse): void {
		if (config.use_publickey) {
			if (request.user) {
				this.SendSuccess(response, request.user.publickey);
			} else {
				this.SendSuccess(response, null);
			}
		} else {
			this.SendSuccess(response, null);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	public get_access_token(request: { user: { publickey: string }, session: { id: string } }, response: IJSONResponse): void {
		if (config.use_publickey) {
			if (request.user) {
				this.SendSuccess(response, Cipher.FixedCrypt(request.session.id, request.user.publickey));
			} else {
				this.SendSuccess(response, null);
			}
		} else {
			this.SendSuccess(response, null);
		}
	}

}

module.exports = PublicKey;
