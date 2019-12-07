/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../../types/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {ConstService} from "./const.service";
import {HttpService} from "./http.service";

/**
 * ファイル
 *
 * @since 0.01
 */
export class FileService extends HttpService {

	constructor(
		protected http: HttpClient,
		protected constService: ConstService
	) {
		super(http, constService);
	}

	public count(query: object, callback: Callback<any>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.http.get(this.endPoint + "/files/auth/count/" + queryString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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

	public query(query: object, option: IQueryOption, callback: Callback<any[]>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.Encode(option, (error: IErrorObject, optionString: string): void => {
					if (!error) {
						this.http.get(this.endPoint + "/files/auth/query/" + queryString + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((results: ArrayBuffer): void => {
							if (results) {
								if (Array.isArray(results)) {
									callback(null, results);
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

	public upload(filename: string, category: string, dataUrl: string, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/files/auth/" + filename, {
			url: dataUrl,
			category,
		}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback({message: "error", code: -1}, null);
				}
			} else {
				callback({message: "error", code: -1}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

	public download(filename: string, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/files/auth/" + filename, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback({message: "error", code: -1}, null);
				}
			} else {
				callback({message: "error", code: -1}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

	public delete(filename: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/files/auth/" + filename, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

}
