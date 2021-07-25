/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {HttpService} from "../base/services/http.service";
import {Errors} from "../base/library/errors";

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
						callback(Errors.networkError("A00234"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00235"), []);
				});
			} else {
				callback(Errors.networkError("A00236"), []);
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
					callback(Errors.serverError(result, "A00237"), null);
				}
			} else {
				callback(Errors.networkError("A00238"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00239"), null);
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
					callback(Errors.serverError(result, "A00240"), null);
				}
			} else {
				callback(Errors.networkError("A00241"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00242"), null);
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
					callback(Errors.serverError(result, "A00243"), null);
				}
			} else {
				callback(Errors.networkError("A00244"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00245"), null);
		});
	}

	/**
	 * @param mailbox
	 * @param UID
	 * @param flags フラグ
	 * @param callback オブジェクトを返すコールバック
	 */
	public addFlags(mailbox: string, UID: string, flags: string[], callback: Callback<object>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/addflags/" + encodeURIComponent(mailbox) + "/" + encodeURIComponent(UID), {flags: flags}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00246"), null);
				}
			} else {
				callback(Errors.networkError("A00247"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00248"), null);
		});
	}

	/**
	 * @param mailbox
	 * @param UID
	 * @param flags フラグ
	 * @param callback オブジェクトを返すコールバック
	 */
	public removeflags(mailbox: string, UID: string, flags: string[], callback: Callback<object>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/removeflags/" + encodeURIComponent(mailbox) + "/" + encodeURIComponent(UID), {flags: flags}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00249"), null);
				}
			} else {
				callback(Errors.networkError("A00250"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00251"), null);
		});
	}

}
