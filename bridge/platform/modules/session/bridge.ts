/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

const HttpBridge = require("../../base/bridge/http_bridge");

export class SessionBridge extends HttpBridge {

	constructor(request: any) {
		super(request);
	}

	public session(callback: (error: IErrorObject, result: any) => void): void {
		const get_session_options: any = {
			url: "http://" + this.domain + "/session/auth",
			method: "GET",
			headers: this.headers,
			json: true,
		};
		this.sessioned_request(get_session_options, callback);
	}
}

module.exports = SessionBridge;
