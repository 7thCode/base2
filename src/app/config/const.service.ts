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

/**
 * クライアントサイドの設定値。
 *
 */
export class ConstService {

	public endPoint: string = "";
	public webSocket: string = "ws://127.0.0.1:3001";

	public headers: any = {
		"Accept": "application/json; charset=utf-8",
		"Content-Type": "application/json; charset=utf-8",
	};

	public use_publickey: boolean = true;
	public is_electron: boolean = false;

	/**
	 *
	 */
	constructor() {

	}

}
