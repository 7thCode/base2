/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

export abstract class HttpBridge {

	protected domain: string = "localhost:3000";
	protected domain_p: string = "167.179.103.85:3000";

	protected headers: any = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"x-requested-with": "XMLHttpRequest",
	};

	public request: any;

	constructor(request) {
		this.request = request;
	}

	protected sessioned_request(request_param: any, callback: (error: IErrorObject, session: any) => void): void {
			this.request(request_param, (error: IErrorObject, from_regeiver: any, body: any): void => {
				if (!error) {
					if (body.code === 0) {
						callback(null, body.value);
					} else {
						callback({code: body.code, message: body.message}, null);
					}
				} else {
					callback({code: -3, message: error.message}, null);
				}
			});

	}

	protected Decode(data: string, callback: (error: IErrorObject, result: any) => void): void {
		try {
			callback(null, JSON.parse(decodeURIComponent(data)));
		} catch (e) {
			callback(e, null);
		}
	}

	protected Encode(data: any, callback: (error: IErrorObject, result: any) => void): void {
		try {
			callback(null, encodeURIComponent(JSON.stringify(data)));
		} catch (e) {
			callback(e, null);
		}
	}

	protected Parse(data: string, callback: (error: IErrorObject, result: any) => void): void {
		try {
			callback(null, JSON.parse(data));
		} catch (e) {
			callback(e, null);
		}
	}

}

module.exports = HttpBridge;
