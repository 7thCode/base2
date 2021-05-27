/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

import {UpdatableService} from "../../platform/base/services/updatable.service";
import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {retry} from "rxjs/operators";

@Injectable({
	providedIn: "root",
})

export class BlogBaseService extends UpdatableService {

	/**
	 *
	 * @param http
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http, "entries");
	}

	// { _id: { yyyy: number, mm: number }, entries: [], count: number }
	protected decorator(group: any): any {
		return group.content;
	}

	/**
	 * クエリー
	 *
	 * @param type
	 * @param query MongoDBのクエリーオブジェクト
	 * @param option MongoDBのオプションオブジェクト
	 * @param callback 結果配列を返すコールバック
	 */
	public group_by(type: string, query: object, option: object, callback: Callback<object[]>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.Encode(option, (error: IErrorObject, optionString: string): void => {
					if (!error) {
						this.http.get(this.endPoint + "/entries/auth/" + type + "/" + queryString + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
							if (result) {
								if (Array.isArray(result.value)) {
									const filterd: any[] = [];
									result.value.forEach((group: { _id: { yyyy: number, mm: number }, entries: [], count: number }) => {
										filterd.push(this.decorator(group));
									});
									callback(null, filterd);
								} else {
									callback({code: result.code, message: result.message + " A9674"}, []);
								}
							} else {
								callback(this.networkError, null);
							}
						}, (error: HttpErrorResponse): void => {
							callback({code: -1, message: error.message + " A9182"}, []);
						});
					} else {
						callback({code: -1, message: "option parse error" + " A3619"}, []);
					}
				});
			} else {
				callback({code: -1, message: "query parse error" + " 7133"}, []);
			}
		});
	}

}
