/**!
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * //opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject} from "../../../../types/platform/universe";

import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";

const path: any = require("path");

const project_root: string = process.cwd();
const models: string = path.join(project_root, "models");
const library: string = path.join(project_root, "server/platform/base/library");

const result: any = require(path.join(library, "result"));

const LocalAccount: any = require(path.join(models, "platform/accounts/account"));

/**
 *
 */
export abstract class Wrapper {

	/**
	 *
	 */
	protected readonly event: any;
	protected readonly config: any;
	protected readonly systemsConfig: any;
	protected readonly usersConfig: any;
	protected readonly logger: any;

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
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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
	 * @returns none
	 */
	protected SendRaw(response: IJSONResponse, object: object): void {
		if (response) {
			response.jsonp(object);
		}
	}

	/**
	 *
	 * @param response
	 * @returns none
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
	 * @returns none
	 */
	protected SendNotFound(response: IJSONResponse): void {
		this.logger.error("notfound");
		if (response) {
			response.status(404).render("error", {message: "Not found.", status: 404});
		}
	}

	/**
	 *
	 * @param data
	 * @param callback
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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
	 * @returns account
	 */
	protected Transform(user: any): IAccountModel {
		let result: any = {
			provider: "",
			auth: AuthLevel.public,
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
				categoly: 0,
				raw: AuthLevel.user,
				login: false,
			},
			entry: "",
			exit: "",
			data: {},
		};

		if (user) {

			let entryPoint: string = "";
			if (this.systemsConfig.entry_point) {
				entryPoint = this.systemsConfig.entry_point;
			}

			let exitPoint: string = "";
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
					const compositeUsername: string = user.id;
					result = {
						provider: user.provider,
						auth: AuthLevel.user,
						username: compositeUsername,
						user_id: user.id,
						content: {mails: [], nickname: user.name.familyName + " " + user.name.givenName, id: "", description: ""},
						enabled: true,
						role: LocalAccount.Role({auth: AuthLevel.user, provider: user.provider}),
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
