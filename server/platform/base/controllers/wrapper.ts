/**!
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * //opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject} from "../../../../types/platform/universe";

import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";

const path: any = require("path");

const models: string = global._models;
const library: string = global._library;

const result: any = require(path.join(library, "result"));

const LocalAccount: any = require(path.join(models, "platform/accounts/account"));

/**
 *
 */
export abstract class Wrapper {

	/**
	 *
	 */
	protected event: any;
	protected config: any;
	protected systemsConfig: any;
	protected usersConfig: any;
	protected logger: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: any, config: any, logger: any) {
		this.event = event;
		this.config = config;
		this.systemsConfig = config.systems;
		this.usersConfig = config.users;
		this.logger = logger;
	}

	/**
	 *
	 * @param response
	 * @param error
	 * @param exist
	 * @param callback
	 */
	protected ifExist(response: IJSONResponse, error: IErrorObject, exist: object, callback: Callback<any>): void {
		if (exist) {
			callback(null, exist);
		} else {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param response
	 * @param error
	 * @param callback
	 */
	protected ifSuccess(response: IJSONResponse, error: IErrorObject, callback: Callback<any>): void {
		if (!error) {
			callback(null, response);
		} else {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param response
	 * @param error
	 */
	protected SendWarn(response: IJSONResponse, error: IErrorObject): void {
		this.logger.warn(JSON.stringify(error));
		if (response) {
			response.jsonp(new result(error.code, error.message, error));
		}
	}

	/**
	 *
	 * @param response
	 * @param error
	 */
	protected SendError(response: IJSONResponse, error: IErrorObject): void {
		this.logger.error(JSON.stringify(error));
		if (response) {
			response.jsonp(new result(error.code, error.message, error));
		}
	}

	/**
	 *
	 * @param response
	 * @param error
	 */
	protected SendFatal(response: IJSONResponse, error: IErrorObject): void {
		this.logger.fatal(JSON.stringify(error));
		if (response) {
			response.status(500).render("error", {message: error.message, status: 500});
		}
	}

	/**
	 *
	 * @param response
	 * @param object
	 */
	protected SendSuccess(response: IJSONResponse, object: object): void {
		if (response) {
			response.jsonp(new result(0, "", object));
		}
	}

	/**
	 *
	 * @param response
	 * @param object
	 */
	protected SendRaw(response: IJSONResponse, object: object): void {
		if (response) {
			response.jsonp(object);
		}
	}

	/**
	 *
	 * @param response
	 */
	protected SendForbidden(response: IJSONResponse): void {
		this.logger.error("Forbidden");
		if (response) {
			response.status(403).render("error", {message: "Forbidden...", status: 403});
		}
	}

	/**
	 *
	 * @param response
	 */
	protected SendNotFound(response: IJSONResponse): void {
		this.logger.error("notfound");
		if (response) {
			response.status(404).render("error", {message: "not found", status: 404});
		}
	}

	/**
	 *
	 * @param data
	 * @param callback
	 */
	protected Decode(data: string, callback: Callback<any>): void {
		try {
			callback(null, JSON.parse(decodeURIComponent(data)));
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param data
	 * @param callback
	 */
	protected Encode(data: any, callback: Callback<any>): void {
		try {
			callback(null, encodeURIComponent(JSON.stringify(data)));
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param data
	 * @param callback
	 * @constructor
	 */
	protected Parse(data: string, callback: Callback<any>): void {
		try {
			callback(null, JSON.parse(data));
		} catch (e) {
			callback(e, null);
		}
	}

	/**
	 *
	 * @param user
	 * @constructor
	 */
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
			if (this.systemsConfig.entry_point) {
				entryPoint = this.systemsConfig.entry_point;
			}

			let exitPoint = "";
			if (this.systemsConfig.exit_point) {
				exitPoint = this.systemsConfig.exit_point;
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
