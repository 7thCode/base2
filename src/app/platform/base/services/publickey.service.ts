/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {HttpService} from "./http.service";
import {Errors} from "../library/errors";

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
						callback(Errors.serverError(result, "A00028"), null);
				}
			} else {
				callback(Errors.networkError("A00029"), null);
			}
		}, (error: HttpErrorResponse) => {
			callback(Errors.networkException(error, "A00030"), null);
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
						callback(Errors.serverError(result, "A00031"), null);
				}
			} else {
				callback(Errors.networkError("A00032"), null);
			}
		}, (error: HttpErrorResponse) => {
			callback(Errors.networkException(error, "A00033"), null);
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
						callback(Errors.serverError(result, "A00034"), null);
				}
			} else {
				callback(Errors.networkError("A00035"), null);
			}
		}, (error: HttpErrorResponse) => {
			callback(Errors.networkException(error, "A00036"), null);
		});
	}

}
