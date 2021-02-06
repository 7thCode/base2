/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

// import * as NodeRSA from "node-rsa";

import { environment } from '../../../environments/environment';

import {HttpService} from "../base/services/http.service";
import {PublicKeyService} from "../base/services/publickey.service";

@Injectable({
	providedIn: "root",
})

/**
 * AUTHサービス
 *
 *
 */
export class AuthService extends HttpService {

	/**
	 * @constructor
	 * @param http
	 * @param PublicKey
	 */
	constructor(
		protected http: HttpClient,
		private PublicKey: PublicKeyService,
	) {
		super(http);
	}

	/**
	 * 公開鍵暗号
	 *
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
			const use_publickey: boolean = environment.use_publickey;
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
	 * ログイン済み?
	 *
	 * @param callback コールバック
	 */
	public is_logged_in(callback: Callback<any>): void {
		this.http.get(this.endPoint + "/auth/local/is_logged_in", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 229"}, null);
		});
	}

	/**
	 * ログイン
	 *
	 * @param username ユーザ名
	 * @param password パスワード
	 * @param callback コールバック
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
							callback({code: -1, message: error.message + " 1019"}, null);
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
	 * TOTPありログイン
	 *
	 * @param username ユーザ名
	 * @param password パスワード
	 * @param code TOTPコード
	 * @param callback コールバック
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
							callback({code: -1, message: error.message + " 7241"}, null);
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
	 * TOTP verify
	 *
	 * @param username ユーザ名
	 * @param code TOTPコード
	 * @param callback コールバック
	 */
	public verify_totp(username: string, code: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error, key): void => {
			if (!error) {
				this.value_encrypt(key, {username, code}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/verify_totp", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
							callback({code: -1, message: error.message + " 7241"}, null);
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
	 * トークンログイン
	 *
	 * @param token トークン
	 * @param callback コールバック
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
			callback({code: -1, message: error.message + " 8923"}, null);
		});
	}

	/**
	 * ログイントークン参照
	 * 自身のログイントークン
	 *
	 * @param callback ログイントークンを返すコールバック
	 */
	public get_login_token(callback: Callback<any>): void {
		const value: any = localStorage.getItem("QR");
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
			callback({code: -1, message: error.message + " 7995"}, null);
		});
	}

	/**
	 * ユーザ登録
	 * メール存在確認あり
	 *
	 * @param username ユーザ名(メールアドレス)
	 * @param password パスワード
	 * @param metadata メタデータ
	 * @param callback コールバック
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
							callback({code: -1, message: error.message + " 2761"}, null);
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
	 * 直接ユーザ登録
	 * メール存在確認なし
	 *
	 * @param username ユーザ名
	 * @param password パスワード
	 * @param metadata メタデータ
	 * @param callback コールバック
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
							callback({code: -1, message: error.message + " 5714"}, null);
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
	 * パスワード更新
	 * メール存在確認あり
	 *
	 * @param username ユーザ名(メールアドレス)
	 * @param password パスワード
	 * @param callback コールバック
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
							callback({code: -1, message: error.message + " 6193"}, null);
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
	 * パスワード更新
	 * メール存在確認なし
	 *
	 * @param username ユーザ名
	 * @param password パスワード
	 * @param callback コールバック
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
							callback({code: -1, message: error.message + " 7291"}, null);
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
	 * パスワード更新
	 * メール存在確認あり
	 *
	 * @param update_username ユーザ名(メールアドレス)
	 * @param callback コールバック
	 */
	public username(update_username: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key): void => {
			if (!error) {
				this.value_encrypt(key, {update_username}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/username", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
							callback({code: -1, message: error.message + " 6193"}, null);
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
	 * yーザ名更新
	 * メール存在確認なし
	 *
	 * @param original_username ユーザ名
	 * @param update_username ユーザ名
	 * @param callback コールバック
	 */
	public username_immediate(original_username: string, update_username: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key: string): void => {
			if (!error) {
				this.value_encrypt(key, {original_username, update_username}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/immediate/username", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
							callback({code: -1, message: error.message + " 7291"}, null);
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
	 * パスワード更新
	 * メール存在確認あり
	 *
	 * @param update_username ユーザ名(メールアドレス)
	 * @param callback コールバック
	 */
	public remove(callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key): void => {
			if (!error) {
				this.value_encrypt(key, {}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/local/remove", {}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
							callback({code: -1, message: error.message + " 6193"}, null);
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
	 * yーザ名更新
	 * メール存在確認なし
	 *
	 * @param original_username ユーザ名
	 * @param update_username ユーザ名
	 * @param callback コールバック
	 */
	public remove_immediate(original_username: string, update_username: string, callback: Callback<any>): void {
		this.PublicKey.fixed((error: IErrorObject, key: string): void => {
			if (!error) {
				this.value_encrypt(key, {original_username, update_username}, (error: IErrorObject, value: any): void => {
					if (!error) {
						this.http.post(this.endPoint + "/auth/immediate/remove", {content: value}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
							callback({code: -1, message: error.message + " 7291"}, null);
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
	 * ログアウト
	 *
	 * @param callback コールバック
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
			callback({code: -1, message: error.message + " 2555"}, null);
		});
	}

	/**
	 * ログイン
	 *
	 * @param username ユーザ名
	 * @param password パスワード
	 * @param callback コールバック
	 */
	public withdraw(callback: Callback<any>): void {
		this.http.post(this.endPoint + "/auth/local/remove", {}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
			callback({code: -1, message: error.message + " 1019"}, null);
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
