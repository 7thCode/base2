/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstService} from "./const.service";

/**
 * HTTP
 *
 * @since 0.01
 */
export abstract class HttpService {

	protected httpOptions: any;
	protected networkError: any;
	public endPoint: string = "";

	constructor(
		protected http: HttpClient,
		protected constService: ConstService,
	) {
		this.endPoint = this.constService.endPoint;
		this.httpOptions = {
			headers: new HttpHeaders({
				"Accept": "application/json; charset=utf-8",
				"Content-Type": "application/json; charset=utf-8",
				"x-requested-with": "XMLHttpRequest",
			}),
			withCredentials: true,
		};
		this.networkError = {code: 10000, message: "network error"};
	}

	protected Decode(data: string, callback: (error: any, result: any) => void): void {
		try {
			callback(null, JSON.parse(decodeURIComponent(data)));
		} catch (error) {
			callback(error, null);
		}
	}

	protected Encode(data: any, callback: (error: any, result: any) => void): void {
		try {
			callback(null, encodeURIComponent(JSON.stringify(data)));
		} catch (error) {
			callback(error, null);
		}
	}

	protected Parse(data: string, callback: (error: any, result: any) => void): void {
		try {
			callback(null, JSON.parse(data));
		} catch (error) {
			callback(error, null);
		}
	}

}
