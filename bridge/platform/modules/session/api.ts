/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const SessionBridge = require("./bridge");

export class SessionAPI {

	private ipcMain: any;
	private bridge: any;

	constructor(ipcMain: any, request: any) {

		this.ipcMain = ipcMain;
		this.bridge = new SessionBridge(request);

		this.ipcMain.on("session", (event, arg): void => {
			this.bridge.session((error, body) => {
				event.returnValue = {error, body};
			});
		});

		this.ipcMain.on("mainSync", (event, arg): void => {
			event.returnValue = "pong";
		});

		this.ipcMain.on("mainAsync", (event, arg) => {
			event.sender.send("renderer1", "pong");
		});


	}
}

module.exports = SessionAPI;
