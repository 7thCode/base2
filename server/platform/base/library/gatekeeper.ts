/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";
import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";
import {Errors} from "./errors";

const result: any = require("./result");

const ConfigModule: any = require("config");
const systemsConfig: any = ConfigModule.systems;

const LocalAccount: any = require("../../../../models/platform/accounts/account");

/**
 * Gatekeeper for request.
 */
export class Gatekeeper {

	/**
	 * Error
	 * @param response
	 * @param error sending error
	 * @returns none
	 */
	public static SendSuccess(response: any): void {
		if (response) {
			response.jsonp(new result(0, "", null));
		}
	}

	/**
	 * Error
	 * @param response
	 * @param error sending error
	 * @returns none
	 */
	public static SendError(response: any, error: IErrorObject): void {
		if (response) {
			response.jsonp(new result(error.code, error.message, error));
		}
	}

	/**
	 * Fatal Page
	 * @param response
	 * @param error sending error
	 * @returns none
	 */
	public static SendFatal(response: any, error: IErrorObject): void {
		if (response) {
			response.status(500).render("error", {message: error.message, status: 500});
		}
	}

	/**
	 * Extend Header
	 * @param request
	 * @param response
	 * @param session
	 * @returns response
	 */
	public static ExtendHeader(request: any, response: any, session: any): any {
		let host: string = request.headers.origin;
		if (!host) {
			host = "http://" + request.headers.host;
		}

		response.header("Access-Control-Allow-Origin", host);
		systemsConfig.extendheader.forEach((header: any) => {
			response.header(header[0], header[1]);
		});

		response.header("Pragma", "no-cache");
		response.header("Cache-Control", "no-cache");
		response.contentType("application/json");
		return response;
	}

	/**
	 * Basic Header
	 * @param request
	 * @param response
	 * @param session
	 * @returns response
	 */
	public static BasicHeader(request: any, response: any, session: any): any {
		response.header("Pragma", "no-cache");
		response.header("Cache-Control", "no-cache");
		response.contentType("application/json");
		return response;
	}

	/**
	 * Exeption Handler
	 * @param response
	 * @param callback
	 * @returns none
	 */
	public static catch(response: any, callback: () => void): void {
		try {
			callback();
		} catch (error) {
			Gatekeeper.SendFatal(response, error);
		}
	}

	/**
	 * default header Handler
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public static default(request: any, response: any, next: () => void): void {
		if (systemsConfig.extendheader_enable) {
			response = Gatekeeper.ExtendHeader(request, response, "");
			next();
		} else {
			if (request.headers["x-requested-with"] === "XMLHttpRequest") {
				response = Gatekeeper.BasicHeader(request, response, "");
				next();
			} else {
				Gatekeeper.SendError(response, Errors.generalError(1, "CSRF?", "S00001"));
			}
		}
	}

	/**
	 * is authenticate Handler
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public static authenticate(request: any, response: any, next: () => void): void {
		if (request.user) {
			if (request.user.enabled) {
				switch (request.user.provider) {
					case "local":
						if (request.isAuthenticated()) {
							next();
						} else {
							Gatekeeper.SendError(response, Errors.generalError(2, "no auth.", "S00002"));
						}
						break;
					case "facebook":
					case "apple":
						next();
						break;
				}
			} else {
				Gatekeeper.SendError(response, Errors.generalError(3, "disabled.", "S00003"));
			}
		} else { // normal case.
			next();
		}
	}


	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public static enabled(request: any, response: IJSONResponse, next: () => void): void {
		if (request.user) {
			const user_id = request.user.user_id;
			LocalAccount.default_find_by_id(null, user_id).then((account: IAccountModel): void => {
				if (account) {
					if (account.enabled) {
						next();
					} else {
						request.logout();
						Gatekeeper.SendError(response, Errors.generalError(1, "disabled.", "S00004"));
					}
				} else {
					Gatekeeper.SendError(response, Errors.generalError(3, "no user.", "S00005"));
				}
			}).catch((error: any) => {
				Gatekeeper.SendFatal(response, Errors.Exception(error, "S00006"));
			})
		} else { // normal case.
			next();
		}
	}

	/**
	 * is page Exception Handler
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public static page_catch(request: any, response: any, next: () => void): void {
		try {
			next();
		} catch (e) {
			response.status(500).render("error", {
				status: 500,
				message: e.message,
				url: request.url,
			});
		}
	}

	/**
	 * page header Handler
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public static page_guard(request: any, response: any, next: () => void): void {
		try {
			if (request.user) {
				if (request.isAuthenticated()) {
					next();
				} else {
					response.status(403).render("error", {status: 403, message: "Forbidden.", url: request.url});
				}
			} else {
				response.status(403).render("error", {status: 403, message: "Forbidden.", url: request.url});
			}
		} catch (e) {
			response.status(500).render("error", {
				status: 500,
				message: e.message,
				url: request.url,
			});
		}
	}
}

module.exports = Gatekeeper;
