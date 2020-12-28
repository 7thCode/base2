/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import { environment } from '../../../../environments/environment';

import {HttpService} from "./http.service";

/**
 * 公開鍵
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})
export class PublicKeyService extends HttpService {

	/**
	 * @constructor
	 * @param http
	 */
	constructor(
		protected http: HttpClient,
	) {
		super(http);
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
			callback({code: -1, message: error.message + " 5005"}, null);
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
			callback({code: -1, message: error.message + " 92"}, null);
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
			callback({code: -1, message: error.message + " 2505"}, null);
		});
	}

}
