/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject} from "../../../../types/platform/universe";
import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";

const result: any = require("../../../../server/platform/base/library/result");

/**
 * APIベース
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
	protected constructor(event: any, config: any, logger: any) {
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
	 * @param object
	 * @returns none
	 */
	protected SendRaw(response: any, object: any): void {
	// 	this.logger.trace(response.req.url);
		if (response) {
			response.jsonp(object);
		} else {
			this.logger.fatal(object);
		}
	}

	/**
	 *
	 * @param response
	 * @param object
	 * @returns none
	 */
	protected SendSuccess(response: IJSONResponse, object: object): void {
// 		this.logger.trace(response.req.url);
		if (response) {
			response.jsonp(new result(0, "", object));
		} else {
			this.logger.fatal(object);
		}
	}

	/**
	 *
	 * @param response
	 * @param code
	 * @param message
	 * @param object
	 * @returns none
	 */
// 	protected SendWarn(response: IJSONResponse, code: number, message: string, object: object): void {
// 		this.logger.info(JSON.stringify(error));
// 		if (response) {
// 			response.jsonp(new result(code, message, object));
// 		}
// 	}

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
 		} else {
			this.logger.fatal(error);
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
			response.jsonp(new result(error.code || 1, error.message || "error.", error));
		} else {
			this.logger.fatal(error);
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
		} else {
			this.logger.fatal(error);
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
		} catch (error: any) {
			callback(error, null);
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
		} catch (error: any) {
			callback(error, null);
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
		} catch (error: any) {
			callback(error, null);
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
			category:  "",
			status:  0,
			type:  "",
			login: false,
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
						category: user.category,
						status: user.status,
						type: user.type,
						login: true,
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
						category: "",
						status: 0,
						type: "",
						login: true,
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
