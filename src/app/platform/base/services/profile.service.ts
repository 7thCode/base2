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
 * ユーザプロファイル
 *
 * @since 0.01
 */
export class ProfileService extends HttpService {

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
	 * ユーザプロファイル参照
	 *
	 * @param callback ユーザプロファイルを戻すコールバック
	 */
	public get(callback: Callback<any>): any {
		this.http.get(this.endPoint + "/profile/auth", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	 * ユーザプロファイル更新
	 * 
	 * @param content ユーザプロファイル
	 * @param callback ユーザプロファイルを戻すコールバック
	 */
	public put(content: object, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/profile/auth", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
