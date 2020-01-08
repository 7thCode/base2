/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IContent} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {ConstService} from "../../../config/const.service";
import {QueryableService} from "./queryable.service";

/**
 * 更新サービス
 *
 * @since 0.01
 */
export abstract class UpdatableService extends QueryableService {

	protected constructor(
		protected http: HttpClient,
		protected constService: ConstService,
		protected model: string,
	) {
		super(http, constService, model);
	}

	public post(content: IContent, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/" + this.model + "/auth", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
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

	public put(id: string, content: IContent, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
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

	// public set(id: string, command: string, content: IContent, callback: Callback<any>): void {
	// 	this.http.put(this.endPoint + "/" + this.model + "/auth/set/" + command + "/" + encodeURIComponent(id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
	// 		if (result) {
	// 			if (result.code === 0) {
	// 				callback(null, result.value);
	// 			} else {
	// 				callback(result, null);
	// 			}
	// 		} else {
	// 			callback(this.networkError, null);
	// 		}
	// 	}, (error: HttpErrorResponse): void => {
	// 		callback({code: -1, message: error.message}, null);
	// 	});
	// }

	public delete(id: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
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

}
