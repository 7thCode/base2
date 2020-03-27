/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

const fs: any = require("fs");
const path: any = require("path");

const NodeRSA: any = require("node-rsa");

const _config: string = global.__config;

const config_root: any = require(path.join(_config, "default"));
const config: any = config_root.systems;

const HttpBridge = require("../../base/bridge/http_bridge");

export class AuthBridge extends HttpBridge {

	private request: any;

	constructor(request: any) {
		super(request);
	}

	private static fixed_public_key(): string {
		let result = "";
		if (config.use_publickey) {
			result = config.publickey;
		}
		return result;
	}

	private static publickey_encrypt(key: string, plain: string, callback: Callback<any>): void {
		try {
			const rsa = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
			callback(null, rsa.encrypt(plain, "base64"));
		} catch (e) {
			callback(e, "");
		}
	}

	private static value_encrypt(key: string, plain: object, callback: Callback<any>) {
		try {
			const use_publickey: boolean = config.use_publickey;
			if (use_publickey) {
				AuthBridge.publickey_encrypt(key, JSON.stringify(plain), (error, encryptedText): void => {
					if (!error) {
						callback(null, encryptedText);
					} else {
						callback(error, "");
					}
				});
			} else {
				callback(null, JSON.stringify(plain));
			}
		} catch (error) {
			callback(error, "");
		}
	}

	public login(username: string, password: string, callback: (error: IErrorObject, body: any) => void): void {
		const key = AuthBridge.fixed_public_key();
		AuthBridge.value_encrypt(key, {username, password}, (error: IErrorObject, value: any): void => {
			if (!error) {

				const login_options: any = {
					url: "http://" + this.domain + "/auth/local/login",
					method: "POST",
					headers: this.headers,
					json: {content: value},
				};

				this.request(login_options, (error: IErrorObject, from_regeiver: any, body: any): void => {
					if (!error) {
						callback(null, body);
					} else {
						callback(error, null);
					}
				});

			} else {
				callback(error, null);
			}
		});
	}

	public login_with_token(token: string, callback: (error: IErrorObject, body: any) => void): void {

		const login_options: any = {
			url: "http://" + this.domain + "/auth/local/login",
			method: "POST",
			headers: this.headers,
			json: {content: token},
		};

		this.request(login_options, (error: IErrorObject, from_regeiver: any, body: any): void => {
			if (!error) {
				callback(null, body);
			} else {
				callback(error, null);
			}
		});
	}

	public logout(callback: (error: IErrorObject, body: any) => void): void {

		const logout_options: any = {
			url: "http://" + this.domain + "/auth/logout",
			method: "GET",
			headers: this.headers,
			json: true,
		};

		this.request(logout_options, (error: IErrorObject, from_regeiver: any, body: any): void => {
			if (!error) {
				callback(null, body);
			} else {
				callback(error, null);
			}
		});

	}

}

module.exports = AuthBridge;
