/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {Injectable} from "@angular/core";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {HttpService} from "../base/services/http.service";
import {Errors} from "../base/library/errors";


/**
 * ファイル
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})

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
						callback(Errors.networkError("A00210"), 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00211"), null);
				});
			} else {
				callback(Errors.responseError("A00212"), null);
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
									callback(Errors.networkError("A00213"), null);
								}
							} else {
								callback(Errors.networkError("A00214"), null);
							}
						}, (error: HttpErrorResponse): void => {
							callback(Errors.networkException(error, "A00215"), null);
						});
					} else {
						callback(Errors.responseError("A00216"), null);
					}
				});
			} else {
				callback(Errors.responseError("A00217"), null);
			}
		});
	}

	/**
	 *
	 * @param filename
	 * @param category
	 * @param params
	 * @param dataUrl
	 * @param callback
	 */
	public upload(filename: string, category: string, params: any, dataUrl: string, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/files/auth/" + filename, {url: dataUrl, category, params}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00218"), null);
				}
			} else {
				callback(Errors.networkError("A00219"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00220"), null);
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
					callback(Errors.serverError(result, "A00221"), null);
				}
			} else {
				callback(Errors.networkError("A00222"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00223"), null);
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
				} else {
					callback(Errors.serverError(result, "A00224"), null);
				}
			} else {
				callback(Errors.networkError("A00225"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00226"), null);
		});
	}

}
