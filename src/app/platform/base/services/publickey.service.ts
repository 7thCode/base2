/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {ConstService} from "../../../config/const.service";
import {HttpService} from "./http.service";

@Injectable({
	providedIn: "root",
})

/**
 * 公開鍵
 *
 * @since 0.01
 */
export class PublicKeyService extends HttpService {

	/**
	 * @constructor
	 * @param http
	 * @param constService
	 */
	constructor(
		protected http: HttpClient,
		protected constService: ConstService,
	) {
		super(http, constService);
	}

	/**
	 * システム固定公開鍵を返す
	 *
	 * @param callback 公開鍵を返すコールバック
	 */
	public fixed(callback: Callback<any>): void {
		this.http.get(this.endPoint + "/publickey/fixed", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				switch (result.code) {
					case 0:
						callback(null, result.value);
						break;
					case 1:
						callback(null, null);
						break;
					default:
						callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse) => {
			callback({code: -1, message: error.message}, null);
		});
	}

	/**
	 * ユーザごとの公開鍵を返す
	 *
	 * @param callback 公開鍵を返すコールバック
	 */
	public dynamic(callback: Callback<any>): void {
		this.http.get(this.endPoint + "/publickey/dynamic", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				switch (result.code) {
					case 0:
						callback(null, result.value);
						break;
					case 1:
						callback(null, null);
						break;
					default:
						callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse) => {
			callback({code: -1, message: error.message}, null);
		});
	}

	/**
	 * ユーザトークン（テスト)
	 *
	 * @param callback コールバック
	 */
	public token(callback: Callback<any>): void {
		this.http.get(this.endPoint + "/publickey/token", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				switch (result.code) {
					case 0:
						callback(null, result.value);
						break;
					case 1:
						callback(null, null);
						break;
					default:
						callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse) => {
			callback({code: -1, message: error.message}, null);
		});
	}

}
