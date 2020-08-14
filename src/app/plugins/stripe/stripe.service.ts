/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

import {UpdatableService} from "../../platform/base/services/updatable.service";
import {Callback, IContent} from "../../../../types/platform/universe";
import {retry} from "rxjs/operators";

@Injectable({
	providedIn: "root",
})

export class StripeService extends UpdatableService {

	/**
	 *
	 * @param http
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http, "articles");
	}

	/**
	 * @returns none
	 */
	protected decorator(value: any): any {
		return value;
	}

	/**
	 * カスタマークリエイト
	 *
	 * @param content　クリエイトデータ
	 * @param callback コールバック
	 */
	public createCustomer(content: IContent, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/stripe/customer/create", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 9911"}, null);
		});
	}

	/**
	 * 単一のオブジェクトを返す
	 *
	 * @param id オブジェクトID
	 * @param callback オブジェクトを返すコールバック
	 */
	public retrieveCustomer(id: string, callback: Callback<object>): void {
		this.http.get(this.endPoint + "/stripe/customer/retrieve/" + encodeURIComponent(id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 8419"}, null);
		});
	}

	/**
	 *
	 * @param id
	 * @param content
	 * @param callback
	 */
	public updateCustomer(id: string, content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/stripe/customer/update/" + encodeURIComponent(id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	 * レコード削除
	 *
	 * @param id 削除レコードID
	 * @param callback コールバック
	 */
	public deleteCustomer(id: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/stripe/customer/delete/" + encodeURIComponent(id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 8242"}, null);
		});
	}

	/**
	 *
	 * @param id
	 * @param content
	 * @param callback
	 */
	public createToken(id: string, content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/stripe/token/create/" + encodeURIComponent(id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 5562"}, null);
		});
	}

	/**
	 * チャージ
	 *
	 * @param content　クリエイトデータ
	 * @param callback コールバック
	 */
	public charge(content: IContent, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/stripe/charge", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 9021"}, null);
		});
	}

}
