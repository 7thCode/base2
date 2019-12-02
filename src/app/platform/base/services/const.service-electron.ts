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

	public endPoint: string = "http://seventh-code.com:3000";
	public webSocket: string = "ws://127.0.0.1:3002";
	public use_publickey: boolean = true;
	public is_electron: boolean = true;

	constructor() {
	}

}
