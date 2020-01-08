/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const path: any = require("path");

const result: any = require("./result");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const systemsConfig: any = require(path.join(_config, "default")).systems;

export class Gatekeeper {

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
		let host = request.headers.origin;
		if (!host) {
			host = "http://" + request.headers.host;
		}

		response.header("Access-Control-Allow-Origin", host);
		systemsConfig.extendheader.forEach((header) => {
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
	public static catch(response, callback: () => void): void {
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
	public static default(request: any, response: any, next: any): void {
		if (systemsConfig.extendheader_enable) {
			response = Gatekeeper.ExtendHeader(request, response, "");
			next();
		} else {
			if (request.headers["x-requested-with"] === "XMLHttpRequest") {
				response = Gatekeeper.BasicHeader(request, response, "");
				next();
			} else {
				Gatekeeper.SendError(response, {code: -1, message: "CSRF?"});
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
	public static authenticate(request: any, response: any, next: any): void {
		if (request.user) {
			switch (request.user.provider) {
				case "local":
					if (request.isAuthenticated()) {
						next();
					} else {
						Gatekeeper.SendError(response, {code: -2, message: "no auth."});
					}
					break;
				case "facebook":
				case "apple":
					next();
					break;
			}
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
	public static page_catch(request: any, response: any, next: any): void {
		try {
			next();
		} catch (e) {
			response.status(500).render("error", {
				status: 500,
				message: "Internal Server Error...",
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
	public static page_guard(request: any, response: any, next: any): void {
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
				message: "Internal Server Error...",
				url: request.url,
			});
		}
	}
}

module.exports = Gatekeeper;
