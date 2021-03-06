/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {Callback} from "../../../../types/platform/universe";

import {QueryableService} from "../base/services/queryable.service";

@Injectable({
	providedIn: "root",
})

export class AccountsService extends QueryableService {

	public model: string = "accounts";

	/**
	 *
	 * @param http
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http, "accounts");
	}

	/**
	 *
	 * @param username
	 * @param content
	 * @param callback
	 */
	public put(user_id: any, content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(user_id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result);
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 9562"}, null);
		});
	}

	/**
	 * 単一のオブジェクトを返す
	 *
	 * @param id オブジェクトID
	 * @param callback オブジェクトを返すコールバック
	 */
	public get_self(callback: Callback<object>): void {
		this.http.get(this.endPoint + "/" + this.model + "/auth", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null,result.value);
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 8419"}, null);
		});
	}

	/**
	 *
	 * @param username
	 * @param content
	 * @param callback
	 */
	public put_self(content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result);
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 9262"}, null);
		});
	}

	/**
	 *
	 * @param id
	 * @param callback
	 */
	public delete(user_id: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(user_id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 7230"}, null);
		});
	}

	/**
	 *
	 * @param user_id
	 * @param callback
	 */
	public is_2fa(user_id: string, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/" + this.model + "/auth/is2fa/" + encodeURIComponent(user_id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value.is_2fa);
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 464"}, null);
		});
	}

	/**
	 *
	 * @param username
	 * @param callback
	 */
	public set_2fa(username: string, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/" + this.model + "/auth/set2fa/" + encodeURIComponent(username), {}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value.qrcode);
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 1860"}, null);
		});
	}

	/**
	 *
	 * @param username
	 * @param callback
	 */
	public reset_2fa(username: string, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/" + this.model + "/auth/reset2fa/" + encodeURIComponent(username), {}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 3179"}, null);
		});
	}

}
