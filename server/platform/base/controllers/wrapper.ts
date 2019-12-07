/**!
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * //opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject} from "../../../../types/universe";

import {IAccountModel, IJSONResponse} from "../../../../types/server";

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const log4js = require("log4js");
log4js.configure(path.join(_config, "platform/logs.json"));
const logger: any = log4js.getLogger("request");

const result: any = require(path.join(library, "result"));
const config: any = require(path.join(_config, "default")).systems;
const LocalAccount: any = require(path.join(models, "platform/accounts/account"));

export abstract class Wrapper {

	protected event: any;

	constructor(event: any) {
		this.event = event;
	}

	protected ifExist(response: IJSONResponse, error: IErrorObject, exist: object, callback: Callback<any>): void {
		if (exist) {
			callback(null, exist);
		} else {
			this.SendError(response, error);
		}
	}

	protected ifSuccess(response: IJSONResponse, error: IErrorObject, callback: Callback<any>): void {
		if (!error) {
			callback(null, response);
		} else {
			this.SendError(response, error);
		}
	}

	protected SendWarn(response: IJSONResponse, error: IErrorObject): void {
		logger.warn(error.message + " " + error.code);
		if (response) {
			response.jsonp(new result(error.code, error.message, error));
		}
	}

	protected SendError(response: IJSONResponse, error: IErrorObject): void {
		logger.error(error.message + " " + error.code);
		if (response) {
			response.jsonp(new result(error.code, error.message, error));
		}
	}

	protected SendFatal(response: IJSONResponse, error: IErrorObject): void {
		logger.fatal(error.message + " " + error.code);
		if (response) {
			response.status(500).render("error", {message: error.message, status: 500});
		}
	}

	protected SendSuccess(response: IJSONResponse, object: object): void {
		if (response) {
			response.jsonp(new result(0, "", object));
		}
	}

	protected SendRaw(response: IJSONResponse, object: object): void {
		if (response) {
			response.jsonp(object);
		}
	}

	protected SendForbidden(response: IJSONResponse): void {
		logger.error("Forbidden");
		if (response) {
			response.status(403).render("error", {message: "Forbidden...", status: 403});
		}
	}

	protected SendNotFound(response: IJSONResponse): void {
		logger.error("notfound");
		if (response) {
			response.status(404).render("error", {message: "not found", status: 404});
		}
	}

	protected Decode(data: string, callback: Callback<any>): void {
		try {
			callback(null, JSON.parse(decodeURIComponent(data)));
		} catch (e) {
			callback(e, null);
		}
	}

	protected Encode(data: any, callback: Callback<any>): void {
		try {
			callback(null, encodeURIComponent(JSON.stringify(data)));
		} catch (e) {
			callback(e, null);
		}
	}

	protected Parse(data: string, callback: Callback<any>): void {
		try {
			callback(null, JSON.parse(data));
		} catch (e) {
			callback(e, null);
		}
	}

	protected Transform(user: any): IAccountModel {
		let result: any = {
			provider: "",
			auth: 100000,
			username: "",
			user_id: "",
			content: {
				mails: [],
				nickname: "",
				id: "",
				description: "",
			},
			enabled: false,
			role: {
				system: false,
				manager: false,
				user: false,
				public: true,
				categoly: 0,
				raw: AuthLevel.user,
				login: false,
			},
			entry: "",
			exit: "",
			data: {},
		};

		if (user) {

			let entryPoint = "";
			if (config.entry_point) {
				entryPoint = config.entry_point;
			}

			let exitPoint = "";
			if (config.exit_point) {
				exitPoint = config.exit_point;
			}

			switch (user.provider) {
				case "local":
					result = {
						create: user.create,
						modify: user.modify,
						provider: user.provider,
						auth: user.auth,
						username: user.username,
						user_id: user.user_id,
						content: user.content,
						enabled: user.enabled,
						role: LocalAccount.Role(user),
						entry: entryPoint,
						exit: exitPoint,
						data: user.data,
					};
					break;
				case "facebook":
				case "apple":
					const compositeUsername: string = user.emails[0].value;
					result = {
						provider: user.provider,
						auth: 200,
						username: compositeUsername,
						user_id: user.id,
						content: {mails: [], nickname: user.name.familyName + " " + user.name.givenName, id: "", description: ""},
						enabled: true,
						role: LocalAccount.Role({auth: 200, provider: user.provider}),
						entry: entryPoint,
						exit: exitPoint,
						data: {},
					};
					break;
			}
		}
		return result;
	}

}

module.exports = Wrapper;
