/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, ISession} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {HttpService} from "./http.service";

/**
 * セッションサービス
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})
export class SessionService extends HttpService {

	private cache: any;
	/**
	 * @constructor
	 * @param http
	 */
	constructor(
		protected http: HttpClient,
	) {
		super(http);
		this. cache = null;
	}

	/**
	 * セッション取得
	 *
	 * @param callback コールバック
	 */
	public get(callback: Callback<ISession>): void {
		if (this.cache) {
			callback(null, this.cache);
		} else {
			this.http.get(this.endPoint + "/session/auth", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
				if (result) {
					if (result.code === 0) {
						this.cache = result.value;
						callback(null, result.value);
					} else {
						callback(result, null);
					}
				} else {
					callback(this.networkError, null);
				}
			}, (error: HttpErrorResponse) => {
				callback({code: -1, message: error.message + " 4553"}, null);
			});
		}
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
					this.cache = result.value;
					callback(null, result.value);
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse) => {
			callback({code: -1, message: error.message + " 3439"}, null);
		});
	}

}
