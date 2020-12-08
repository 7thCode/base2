/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {retry} from "rxjs/operators";

import {PublicKeyService} from "../../platform/base/services/publickey.service";
import {HttpService} from "../../platform/base/services/http.service";


@Injectable({
	providedIn: "root",
})

export class StripeService extends HttpService {

	// private stripe: any;
	/**
	 *
	 * @param http
	 * @param PublicKey
	 */
	constructor(
		public http: HttpClient,
		private PublicKey: PublicKeyService,
	) {
		super(http);
		// this.stripe = this.loadStripe();
	}


	// private async loadStripe() {
	// 	return await loadStripe('pk_test_Ht8bLgBXv2BeLuDy7nXWpoJV00pQHaaDCK');
	// }

	/*
	* @param key 公開鍵
	* @param plain 原文
	* @param callback 暗号を返すコールバック
	*/
	private static publickey_encrypt(key: string, plain: string, callback: Callback<any>): void {
		try {


			// RSA
			// 		const rsa: NodeRSA = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
			// 		callback(null, rsa.encrypt(plain, "base64"));

			callback(null, plain);
		} catch (e) {
			callback(e, "");
		}
	}

	/**
	 * 公開鍵暗号
	 *
	 * @param key 公開鍵
	 * @param plain 原文
	 * @param callback 暗号を返すコールバック
	 */
	private value_encrypt(key: string, plain: object, callback: Callback<any>) {
		try {
			StripeService.publickey_encrypt(key, JSON.stringify(plain), (error, encryptedText): void => {
				if (!error) {
					callback(null, encryptedText);
				} else {
					callback(error, "");
				}
			});
		} catch (error) {
			callback(error, "");
		}
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
	public createCustomer(content: any, callback: Callback<any>): void {
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
	public retrieveCustomer(callback: Callback<object>): void {
		this.http.get(this.endPoint + "/stripe/customer/retrieve", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	public updateCustomer(content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/stripe/customer/update", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	public deleteCustomer(callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/stripe/customer/delete", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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

	/*
	 * @param id
	 * @param content
	 * @param callback
	 */
	public createSource(content: any, callback: Callback<any>): void {
		/*
				this.stripe.createToken(content).then((token: any) => {
					console.log(token);
				}).catch((error: any) => {
					console.log(error);
				});
		*/
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, content, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/stripe/source/create", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/*
	 * @param id
	 * @param content
	 * @param callback
	 */
	public retrieveSource(index: number, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/stripe/source/retrieve/" + index, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 5462"}, null);
		});
	}

	/*
	 * @param id
	 * @param content
	 * @param callback
	 */
	public updateSource(index: number, content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/stripe/source/update/" + index, content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 5462"}, null);
		});
	}

	/*
 * @param id
 * @param content
 * @param callback
 */
	public deleteSource(index: number, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/stripe/source/delete/" + index, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 5462"}, null);
		});
	}


	/**
	 * チャージ
	 *
	 * @param content　クリエイトデータ
	 * @param callback コールバック
	 */
	public charge(content: any, callback: Callback<any>): void {
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
