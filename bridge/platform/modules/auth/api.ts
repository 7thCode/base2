/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const AuthBridge = require("./bridge");

export class AuthAPI {

	private ipcMain: any;
	private bridge: any;

	constructor(ipcMain: any, request: any) {

		this.ipcMain = ipcMain;
		this.bridge = new AuthBridge(request);

		this.ipcMain.on("login", (event, arg): void => {
			this.bridge.login(arg.username, arg.password, (error, body) => {
				event.returnValue = {error, body};
			});
		});

		this.ipcMain.on("login-with-token", (event, arg): void => {
			this.bridge.login_with_token(arg.token, (error, body) => {
				event.returnValue = {error, body};
			});
		});

		this.ipcMain.on("logout", (event, arg): void => {
			this.bridge.logout((error, body) => {
				event.returnValue = {error, body};
			});
		});

	}
}

module.exports = AuthAPI;
