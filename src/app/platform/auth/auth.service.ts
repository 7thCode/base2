/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import * as NodeRSA from "node-rsa";

import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {ConstService} from "../../config/const.service";
import {HttpService} from "../base/services/http.service";
import {PublicKeyService} from "../base/services/publickey.service";

@Injectable({
	providedIn: "root",
})

export class AuthService extends HttpService {

	constructor(
		protected http: HttpClient,
		public constService: ConstService,
		private PublicKey: PublicKeyService,
	) {
		super(http, constService);
	}

	/**
	 * @param key
	 * @param plain
	 * @param callback
	 * @returns none
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
	 * @param key
	 * @param plain
	 * @param callback
	 * @returns none
	 */
	private value_encrypt(key: string, plain: object, callback: Callback<any>) {
		try {
			const use_publickey = this.constService.use_publickey;
			if (use_publickey) {
				AuthService.publickey_encrypt(key, JSON.stringify(plain), (error, encryptedText): void => {
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
	 * @param username
	 * @param password
	 * @param callback
	 * @returns none
	 */
	public login(username: string, password: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, {username, password}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/login", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
							if (result) {
								if (result.code === 0) {
									localStorage.setItem("QR", value);
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
	 * @param username
	 * @param password
	 * @param code
	 * @param callback
	 * @returns none
	 */
	public login_totp(username: string, password: string, code: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, {username, password, code}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/login_totp", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	 * @param token
	 * @param callback
	 * @returns none
	 */
	public login_with_token(token: string, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/auth/local/login", {content: token}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					localStorage.setItem("QR", token);
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

	/**
	 * @param callback
	 * @returns none
	 */
	public get_login_token(callback: Callback<any>): void {
		const value = localStorage.getItem("QR");
		this.http.get(this.endPoint + "/auth/token/qr/" + encodeURIComponent(value), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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

	/**
	 * @param username
	 * @param password
	 * @param metadata
	 * @param callback
	 * @returns none
	 */
	public regist(username: string, password: string, metadata: any, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key: string): void => {
			if (!error) {
				this.value_encrypt(key, {username, password, metadata}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/register", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((account: any): void => {
							if (account) {
								if (account.code === 0) {
									callback(null, account.value);
								} else {
									callback(account, null);
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
	 * @param username
	 * @param password
	 * @param metadata
	 * @param callback
	 * @returns none
	 */
	public regist_immediate(username: string, password: string, metadata: any, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key: string): void => {
			if (!error) {
				this.value_encrypt(key, {username, password, metadata}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/immediate/register", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((account: any): void => {
							if (account) {
								if (account.code === 0) {
									callback(null, account.value);
								} else {
									callback(account, null);
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
	 * @param username
	 * @param password
	 * @param callback
	 * @returns none
	 */
	public password(username: string, password: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key): void => {
			if (!error) {
				this.value_encrypt(key, {username, password}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/password", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	 * @param username
	 * @param password
	 * @param callback
	 * @returns none
	 */
	public password_immediate(username: string, password: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key: string): void => {
			if (!error) {
				this.value_encrypt(key, {username, password}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/immediate/password", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	 *
	 * @param callback
	 * @returns none
	 */
	public logout(callback: Callback<any>): void {
		this.http.get(this.endPoint + "/auth/logout", this.httpOptions).pipe(retry(3)).subscribe((account: any): void => {
			if (account) {
				if (account.code === 0) {
					localStorage.removeItem("QR");
					callback(null, account.value);
				} else {
					callback(null, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

	/*
		public loginFacebook(callback: Callback<any>): void {
			this.http.get(this.endPoint + "/auth/facebook", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
	*/
}
