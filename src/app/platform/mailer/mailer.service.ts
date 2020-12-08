/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {HttpService} from "../base/services/http.service";

@Injectable({
	providedIn: "root",
})

export class MailerService extends HttpService {

	public model: string = "mailer";

	/**
	 *
	 * @param http
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http);
	}

	/**
	 * クエリー
	 * @param mailbox
	 * @param option
	 * @param callback 結果配列を返すコールバック
	 */
	public query(mailbox: string, option: { start: number, limit: number }, callback: Callback<any>): void {
		this.Encode(option, (error: IErrorObject, optionString: string): void => {
			if (!error) {
				this.http.get(this.endPoint + "/" + this.model + "/auth/query/" + encodeURIComponent(mailbox) + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						callback(null, result);
					} else {
						callback(this.networkError, null);
					}
				}, (error: HttpErrorResponse): void => {
					callback({code: -1, message: error.message + " 918"}, []);
				});
			} else {
				callback({code: -1, message: "option parse error" + " 3319"}, []);
			}
		});
	}

	/**
	 * 単一のオブジェクトを返す
	 * @param mailbox
	 * @param UID メールID
	 * @param callback オブジェクトを返すコールバック
	 */
	public get(mailbox: string, UID: string, callback: Callback<object>): void {
		this.http.get(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(mailbox) + "/" + encodeURIComponent(UID), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 8499"}, null);
		});
	}

	/**
	 * 単一のオブジェクトを返す
	 * @param message メッセージ
	 * @param callback オブジェクトを返すコールバック
	 */
	public send(message: any, callback: Callback<object>): void {
		this.http.post(this.endPoint + "/" + this.model + "/auth", message, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 8499"}, null);
		});
	}

	/**
	 * @param mailbox
	 * @param UID
	 * @param callback
	 */
	public delete(mailbox: string, UID: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(mailbox) + "/" + encodeURIComponent(UID), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	 * @param mailbox
	 * @param UID
	 * @param flags フラグ
	 * @param callback オブジェクトを返すコールバック
	 */
	public addFlags(mailbox: string, UID: string,flags: string[], callback: Callback<object>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/addflags/" + encodeURIComponent(mailbox)+ "/" + encodeURIComponent(UID), {flags:flags}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 8499"}, null);
		});
	}

	/**
	 * @param mailbox
	 * @param UID
	 * @param flags フラグ
	 * @param callback オブジェクトを返すコールバック
	 */
	public removeflags(mailbox: string, UID: string,flags: string[], callback: Callback<object>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/removeflags/" + encodeURIComponent(mailbox)+ "/" + encodeURIComponent(UID),{flags:flags}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 8499"}, null);
		});
	}

}
