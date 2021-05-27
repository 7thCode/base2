/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {HttpService} from "../../platform/base/services/http.service";
import {Injectable} from "@angular/core";

/**
 * ファイル
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})

export class NativeFilesService extends HttpService {

	/**
	 *
	 * @param http
	 */
	constructor(
		protected http: HttpClient,
	) {
		super(http);
	}

	/**
	 *
	 * @param query
	 * @param callback
	 */
	public count(query: object, callback: Callback<any>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.http.get(this.endPoint + "/nfiles/auth/count/" + queryString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						callback(null, result);
					} else {
						callback(this.networkError, 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback({code: -1, message: error.message + " A1581"}, null);
				});
			} else {
				callback({code: -1, message: "query parse error. A7611"}, null);
			}
		});
	}

	/**
	 *
	 * @param query
	 * @param option
	 * @param callback
	 */
	public query(query: object, option: IQueryOption, callback: Callback<any[]>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.Encode(option, (error: IErrorObject, optionString: string): void => {
					if (!error) {
						this.http.get(this.endPoint + "/nfiles/auth/query/" + queryString + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((results: ArrayBuffer): void => {
							if (results) {
								if (Array.isArray(results)) {
									callback(null, results);
								} else {
									callback({code: -1, message: "error. A7611"}, null);
								}
							} else {
								callback(this.networkError, null);
							}
						}, (error: HttpErrorResponse): void => {
							callback({code: -1, message: error.message + " A5814"}, null);
						});
					} else {
						callback({code: -1, message: "option parse error. A9204"}, null);
					}
				});
			} else {
				callback({code: -1, message: "query parse error. A7211"}, null);
			}
		});
	}

	/**
	 *
	 * @param filename
	 * @param category
	 * @param dataUrl
	 * @param callback
	 */
	public upload(filename: string, category: string, dataUrl: string, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/nfiles/auth/" + filename, {url: dataUrl, category}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback({message: "error. A8346", code: -1}, null);
				}
			} else {
				callback({message: "error. A8176", code: -1}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " A6677"}, null);
		});
	}

	/**
	 *
	 * @param filename
	 * @param callback
	 */
	public download(filename: string, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/nfiles/auth/" + filename, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback({message: "error. A3293", code: -1}, null);
				}
			} else {
				callback({message: "error. A6565", code: -1}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " A8199"}, null);
		});
	}

	/**
	 *
	 * @param filename
	 * @param callback
	 */
	public delete(filename: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/nfiles/auth/" + filename, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " A4155"}, null);
		});
	}

}
