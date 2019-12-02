/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/universe";

const path: any = require("path");

const result: any = require("./result");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const systemsConfig: any = require(path.join(_config, "default")).systems;

export class Gatekeeper {

	public static SendError(response: any, error: IErrorObject): void {
		if (response) {
			response.jsonp(new result(error.code, error.message, error));
		}
	}

	public static SendFatal(response: any, error: IErrorObject): void {
		if (response) {
			response.status(500).render("error", {message: error.message, status: 500});
		}
	}

	public static CorsHeader(response: any, session: any): any {
		response.header("Access-Control-Allow-Origin", "*");
		response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
		response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin");
		response.header("Pragma", "no-cache");
		response.header("Cache-Control", "no-cache");
		response.contentType("application/json");
		return response;
	}

	public static BasicHeader(response: any, session: any): any {
		response.header("Pragma", "no-cache");
		response.header("Cache-Control", "no-cache");
		response.contentType("application/json");
		return response;
	}

	// public static exception(request: any, response: any, next: any): void {
	// 	try {
	// 		next();
	// 	} catch (e) {
	// 		Gatekeeper.SendFatal(response, e);
	// 	}
	// }

	public static catch(response, callback: () => void): void {
		try {
			callback();
		} catch (error) {
			Gatekeeper.SendFatal(response, error);
		}
	}

	public static guard(request: any, response: any, next: any): void {
		if (systemsConfig.cors_enable) {
			response = Gatekeeper.CorsHeader(response, "");
			next();
		} else {
			if (request.headers["x-requested-with"] === "XMLHttpRequest") {
				response = Gatekeeper.BasicHeader(response, "");
				next();
			} else {
				Gatekeeper.SendError(response, {code: -1, message: "CSRF?"});
			}
		}
	}

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
