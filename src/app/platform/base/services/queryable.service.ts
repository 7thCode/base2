/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {ConstService} from "../../../config/const.service";
import {HttpService} from "./http.service";

/**
 * 参照サービス
 *
 * @since 0.01
 */
export abstract class QueryableService extends HttpService {

	protected constructor(
		protected http: HttpClient,
		protected constService: ConstService,
		protected model: string,
	) {
		super(http, constService);
	}

	public query(query: object, option: IQueryOption, callback: Callback<object[]>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.Encode(option, (error: IErrorObject, optionString: string): void => {
					if (!error) {
						this.http.get(this.endPoint + "/" + this.model + "/auth/query/" + queryString + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((results: ArrayBuffer): void => {
							if (results) {
								if (Array.isArray(results)) {
									const filterd = [];
									results.forEach((result) => {
										filterd.push(this.decorator(result));
									});
									callback(null, filterd);
								} else {
									callback({code: -1, message: "error"}, null);
								}
							} else {
								callback(this.networkError, null);
							}
						}, (error: HttpErrorResponse): void => {
							callback({code: -1, message: error.message}, null);
						});
					} else {
						callback({code: -1, message: "option parse error"}, null);
					}
				});
			} else {
				callback({code: -1, message: "query parse error"}, null);
			}
		});
	}

	public count(query: object, callback: Callback<number>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.http.get(this.endPoint + "/" + this.model + "/auth/count/" + queryString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						callback(null, result);
					} else {
						callback(this.networkError, 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback({code: -1, message: error.message}, null);
				});
			} else {
				callback({code: -1, message: "query parse error"}, null);
			}
		});
	}

	public get(id: string, callback: Callback<object>): void {
		this.http.get(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, this.decorator(result.value));
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

	protected decorator(value: object): object {
		return value;
	}

}
