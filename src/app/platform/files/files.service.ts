/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {retry} from "rxjs/operators";

import { environment } from '../../../environments/environment';

import {HttpService} from "../base/services/http.service";

/**
 * ファイル
 *
 * @since 0.01
 */
export class FilesService extends HttpService {

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
				this.http.get(this.endPoint + "/files/auth/count/" + queryString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						callback(null, result);
					} else {
						callback(this.networkError, 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback({code: -1, message: error.message + " 1581"}, null);
				});
			} else {
				callback({code: -1, message: "query parse error. 7611"}, null);
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
						this.http.get(this.endPoint + "/files/auth/query/" + queryString + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((results: ArrayBuffer): void => {
							if (results) {
								if (Array.isArray(results)) {
									callback(null, results);
								} else {
									callback({code: -1, message: "error. 7611"}, null);
								}
							} else {
								callback(this.networkError, null);
							}
						}, (error: HttpErrorResponse): void => {
							callback({code: -1, message: error.message + " 5814"}, null);
						});
					} else {
						callback({code: -1, message: "option parse error. 9204"}, null);
					}
				});
			} else {
				callback({code: -1, message: "query parse error. 7211"}, null);
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
		this.http.post(this.endPoint + "/files/auth/" + filename, {
			url: dataUrl,
			category,
		}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback({message: "error. 8346", code: -1}, null);
				}
			} else {
				callback({message: "error. 8176", code: -1}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 6677"}, null);
		});
	}

	/**
	 *
	 * @param filename
	 * @param callback
	 */
	public download(filename: string, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/files/auth/" + filename, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback({message: "error. 3293", code: -1}, null);
				}
			} else {
				callback({message: "error. 6565", code: -1}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 8199"}, null);
		});
	}

	/**
	 *
	 * @param filename
	 * @param callback
	 */
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
			callback({code: -1, message: error.message + " 4155"}, null);
		});
	}

}
