/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../../types/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import * as NodeRSA from "node-rsa";

import {ConstService} from "./const.service";
import {PublicKeyService} from "./publickey.service";
import {UpdatableService} from "./updatable.service";

/**
 * 更新サービス
 *
 * @since 0.01
 */
export abstract class SecureUpdatableService extends UpdatableService {

	protected constructor(
		protected http: HttpClient,
		protected constService: ConstService,
		protected model: string,
		protected PublicKey: PublicKeyService,
	) {
		super(http, constService, model);
	}

	private static publickey_encrypt(key: string, plain: string, callback: Callback<any>): void {
		try {
			const rsa = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
			callback(null, rsa.encrypt(plain, "base64"));
		} catch (e) {
			callback(e, "");
		}
	}

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
