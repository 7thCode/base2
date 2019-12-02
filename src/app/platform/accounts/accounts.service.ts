/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {Callback} from "../../../../types/universe";
import {ConstService} from "../base/services/const.service";
import {QueryableService} from "../base/services/queryable.service";

@Injectable({
	providedIn: "root",
})

export class AccountsService extends QueryableService {

	public model: string = "accounts";

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService, "accounts");
	}

	public put(username: any, content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(username), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result);
				} else {
					callback(result, null);
				}
			} else {
				callback({code: 10000, message: "network error"}, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

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

	public is_2fa(username, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/" + this.model + "/auth/is2fa/" + encodeURIComponent(username), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message}, null);
		});
	}

	public set_2fa(username, callback: Callback<any>): void {
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
			callback({code: -1, message: error.message}, null);
		});
	}

	public reset_2fa(username, callback: Callback<any>): void {
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
			callback({code: -1, message: error.message}, null);
		});
	}

}
