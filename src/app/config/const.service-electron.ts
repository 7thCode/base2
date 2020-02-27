/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Injectable} from "@angular/core";

@Injectable({
	providedIn: "root",
})

export class ConstService {

	public endPoint: string = "https://seventh-code.com";
	public webSocket: string = "wss://seventh-code.com/ws";

	public headers: any = {
		"Accept": "application/json; charset=utf-8",
		"Content-Type": "application/json; charset=utf-8",
	};

	public use_publickey: boolean = true;
	public is_electron: boolean = true;

	/**
	 *
	 */
	constructor() {
	}

}
