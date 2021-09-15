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
import {Errors} from "../../platform/base/library/errors";

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
	}

	/*
	* @param key 公開鍵
	* @param plain 原文
	* @param callback 暗号を返すコールバック
	*/
	private static publickey_encrypt(key: string, plain: string, callback: Callback<any>): void {
		try {
			// 	const rsa: NodeRSA = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
			// 	callback(null, rsa.encrypt(plain, "base64"));
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
	 * is カスタマー
	 *
	 * @param callback コールバック
	 */
	public isCustomer(callback: Callback<any>): void {
		this.http.get(this.endPoint + '/stripe/iscustomer', this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00060"), null);
				}
			} else {
				callback(Errors.networkError("A00061"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00062"), null);
		});
	}

	/**
	 * カスタマークリエイト
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public createCustomer(content: any, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/stripe/customer/create", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00063"), null);
				}
			} else {
				callback(Errors.networkError("A00064"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00065"), null);
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
					callback(Errors.serverError(result, "A00066"), null);
				}
			} else {
				callback(Errors.networkError("A00067"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00068"), null);
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
					callback(Errors.serverError(result, "A00069"), null);
				}
			} else {
				callback(Errors.networkError("A00070"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00071"), null);
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
					callback(Errors.serverError(result, "A00072"), null);
				}
			} else {
				callback(Errors.networkError("A00073"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00074"), null);
		});
	}

	/*
	*
	*  code 0: OK
	*  code 1: no customer
	*  else error
	*
	 * @param id
	 * @param content
	 * @param callback
	 */
	public createSource(content: any, callback: Callback<any>): void {
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, content, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/stripe/source/create", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
							if (result) {
								// 1: no customer
								if (result.code === 0) {
									callback(null, result);
								} else {
									callback(Errors.serverError(result, "A00075"), null);
								}
							} else {
								callback(Errors.networkError("A00076"), null);
							}
						}, (error: HttpErrorResponse): void => {
							callback(Errors.networkException(error, "A00077"), null);
						});
					} else {
						callback(Errors.generalError(error.code, error.message, "A00174"), null);
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
					callback(Errors.serverError(result, "A00078"), null);
				}
			} else {
				callback(Errors.networkError("A00079"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00080"), null);
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
					callback(Errors.serverError(result, "A00081"), null);
				}
			} else {
				callback(Errors.networkError("A00082"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00083"), null);
		});
	}

	/*
	 * @param id
	 * @param content
	 * @param callback
	 */
	public deleteSource(card_id: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/stripe/source/delete/" + card_id, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result);
				} else {
					callback(Errors.serverError(result, "A00084"), null);
				}
			} else {
				callback(Errors.networkError("A00085"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00086"), null);
		});
	}

	/**
	 * チャージ
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public charge(content: any, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/stripe/charge", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00087"), null);
				}
			} else {
				callback(Errors.networkError("A00088"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00089"), null);
		});
	}

	/**
	 * 定期
	 *
	 * https://dashboard.stripe.com/test/products/create
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public subscribe(content: any, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/stripe/subscribe", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00090"), null);
				}
			} else {
				callback(Errors.networkError("A00091"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00092"), null);
		});
	}


	/**
	 * 定期
	 *
	 * https://dashboard.stripe.com/test/products/create
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public is_subscribe(callback: Callback<any>): void {
		this.http.get(this.endPoint + "/stripe/subscribe", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00093"), null);
				}
			} else {
				callback(Errors.networkError("A00094"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00095"), null);
		});
	}


	/**
	 * 定期
	 *
	 * https://dashboard.stripe.com/test/products/create
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public update_subscribe(content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/stripe/subscribe", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00096"), null);
				}
			} else {
				callback(Errors.networkError("A00097"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00098"), null);
		});
	}

	/**
	 * 定期
	 *
	 * https://dashboard.stripe.com/test/products/create
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public cancel_subscribe(callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/stripe/subscribe", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00099"), null);
				}
			} else {
				callback(Errors.networkError("A00100"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00101"), null);
		});
	}

}
