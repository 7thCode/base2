/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import * as NodeRSA from "node-rsa";

import {ConstService} from "../../../config/const.service";
import {PublicKeyService} from "./publickey.service";
import {UpdatableService} from "./updatable.service";

/**
 * 秘匿更新サービスのベースクラス
 *
 * @since 0.01
 */
export abstract class SecureUpdatableService extends UpdatableService {

	/**
	 * @constructor
	 * @param http
	 * @param constService
	 * @param model
	 * @param PublicKey
	 */
	protected constructor(
		protected http: HttpClient,
		protected constService: ConstService,
		protected model: string,
		protected PublicKey: PublicKeyService,
	) {
		super(http, constService, model);
	}

	/**
	 * 公開鍵暗号
	 *
	 * @param key 公開鍵
	 * @param plain 原文
	 * @param callback 暗号文を返すコールバック
	 */
	private static publickey_encrypt(key: string, plain: string, callback: Callback<any>): void {
		try {
			const rsa = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
			callback(null, rsa.encrypt(plain, "base64"));
		} catch (e) {
			callback(e, "");
		}
	}

	/**
	 * 公開鍵暗号化
	 *
	 * @param key 公開鍵
	 * @param plain 原文
	 * @param callback 暗号文を返すコールバック
	 */
	private value_encrypt(key: string, plain: object, callback: Callback<any>): void {
		try {
			const use_publickey = this.constService.use_publickey;
			if (use_publickey) {
				SecureUpdatableService.publickey_encrypt(key, JSON.stringify(plain), (error, encryptedText): void => {
					if (!error) {
						callback(null, encryptedText);
					} else {
						callback(error, "");
					}
				});
			} else {
				callback(null, JSON.stringify(plain));
			}
		} catch (error) {
			callback(error, "");
		}
	}

	/**
	 * 秘匿更新
	 *
	 * @param content 更新内容
	 * @param callback コールバック
	 */
	public post(content: object, callback: Callback<any>): void {
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, content, (error: IErrorObject, enc_content: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/" + this.model + "/auth", {content: enc_content}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * 秘匿更新
	 *
	 * @param id 更新レコードID
	 * @param conten 更新内容
	 * @param callback コールバック
	 */
	public put(id: string, content: object, callback: Callback<any>): void {
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, content, (error: IErrorObject, enc_content: any): void => {
					if (!error) {
						this.http.put(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), {content: enc_content}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

}
