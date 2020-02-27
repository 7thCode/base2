/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, ISession} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {ConstService} from "../../../config/const.service";
import {HttpService} from "./http.service";

@Injectable({
	providedIn: "root",
})

/**
 * セッションサービス
 *
 * @since 0.01
 */
export class SessionService extends HttpService {

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
	 * セッション取得
	 *
	 * @param callback コールバック
	 */
	public get(callback: Callback<ISession>): void {
		this.http.get(this.endPoint + "/session/auth", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
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
	 * セッション更新
	 *
	 * @param content 更新内容
	 * @param callback コールバック
	 */
	public put(content: object, callback: Callback<ISession>): void {
		this.http.put(this.endPoint + "/session/auth", {data: content}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
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
