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
import {Errors} from "../../platform/base/library/errors";

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
						callback(Errors.networkError("A00043"), 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00044"), null);
				});
			} else {
				callback(Errors.responseError("A00045"), null);
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
									callback(Errors.networkError("A00046"), null);
								}
							} else {
								callback(Errors.networkError("A00047"), null);
							}
						}, (error: HttpErrorResponse): void => {
							callback(Errors.networkException(error, "A00048"), null);
						});
					} else {
						callback(Errors.responseError("A00049"), null);
					}
				});
			} else {
				callback(Errors.responseError("A00050"), null);
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
					callback(Errors.serverError(result, "A00051"), null);
				}
			} else {
				callback(Errors.networkError("A00052"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00053"), null);
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
					callback(Errors.serverError(result, "A00054"), null);
				}
			} else {
				callback(Errors.networkError("A00055"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00056"), null);
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
				} else {
					callback(Errors.serverError(result, "A00057"), null);
				}
			} else {
				callback(Errors.networkError("A00058"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00059"), null);
		});
	}

}
