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
 * ユーザプロファイル
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})
export class ProfileService extends HttpService {

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
						callback(Errors.serverError(result, "A00111"), null);
				}
			} else {
				callback(Errors.networkError("A00112"), null);
			}
		}, (error: HttpErrorResponse) => {
			callback(Errors.networkException(error, "A00113"), null);
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
					callback(Errors.serverError(result, "A00114"), null);
				}
			} else {
				callback(Errors.networkError("A00115"), null);
			}
		}, (error: HttpErrorResponse) => {
			callback(Errors.networkException(error, "A00116"), null);
		});
	}

}
