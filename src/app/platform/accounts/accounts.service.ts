/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {Callback} from "../../../../types/platform/universe";

import {QueryableService} from "../base/services/queryable.service";
import {Errors} from "../base/library/errors";

@Injectable({
	providedIn: "root",
})

export class AccountsService extends QueryableService {

	/**
	 *
	 * @param http
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http, "accounts");
	}

	/**
	 *
	 * @param user_id
	 * @param content
	 * @param callback
	 */
	public put(user_id: any, content: any, callback: Callback<any>): void {
		if (user_id) {
			this.http.put(this.endPoint + "/accounts/auth/" + encodeURIComponent(user_id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
				if (result) {
					if (result.code === 0) {
						callback(null, result);
					} else {
						callback(Errors.serverError(result, "A00117"), null);
					}
				} else {
					callback(Errors.networkError("A00118"), null);
				}
			}, (error: HttpErrorResponse): void => {
				callback(Errors.networkException(error, "A00119"), null);
			});
		} else {
			callback(Errors.generalError(-1, "'user_id' required.", "A00143"), null);
		}
	}

	/**
	 * 単一のオブジェクトを返す
	 *
	 * @param callback オブジェクトを返すコールバック
	 */
	public get_self(callback: Callback<object>): void {
		this.http.get(this.endPoint + "/accounts/auth", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result.value);
				} else {
					callback(Errors.serverError(result, "A00120"), null);
				}
			} else {
				callback(Errors.networkError("A00121"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00122"), null);
		});
	}

	/**
	 *
	 * @param content
	 * @param callback
	 */
	public put_self(content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/accounts/auth", content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, result);
				} else {
					callback(Errors.serverError(result, "A00123"), null);
				}
			} else {
				callback(Errors.networkError("A00124"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00125"), null);
		});
	}

	/**
	 *
	 * @param user_id
	 * @param callback
	 */
	public delete(user_id: string, callback: Callback<any>): void {
		if (user_id) {
			this.http.delete(this.endPoint + "/accounts/auth/" + encodeURIComponent(user_id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
				if (result) {
					if (result.code === 0) {
						callback(null, result.value);
					} else {
						callback(Errors.serverError(result, "A00126"), null);
					}
				} else {
					callback(Errors.networkError("A00127"), null);
				}
			}, (error: HttpErrorResponse): void => {
				callback(Errors.networkException(error, "A00128"), null);
			});
		} else {
			callback(Errors.generalError(-1, "'user_id' required.", "A00143"), null);
		}
	}

	/**
	 *
	 * @param user_id
	 * @param callback
	 */
	public is_2fa(user_id: string, callback: Callback<any>): void {
		if (user_id) {
			this.http.get(this.endPoint + "/accounts/auth/is2fa/" + encodeURIComponent(user_id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
				if (result) {
					if (result.code === 0) {
						callback(null, result.value.is_2fa);
					} else {
						callback(Errors.serverError(result, "A00129"), null);
					}
				} else {
					callback(Errors.networkError("A00130"), null);
				}
			}, (error: HttpErrorResponse): void => {
				callback(Errors.networkException(error, "A00131"), null);
			});
		} else {
			callback(Errors.generalError(-1, "'user_id' required.", "A00143"), null);
		}
	}

	/**
	 *
	 * @param user_id
	 * @param callback
	 */
	public set_2fa(user_id: string, callback: Callback<any>): void {
		if (user_id) {
			this.http.post(this.endPoint + "/accounts/auth/set2fa/" + encodeURIComponent(user_id), {}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
				if (result) {
					if (result.code === 0) {
						callback(null, result.value.qrcode);
					} else {
						callback(Errors.serverError(result, "A00132"), null);
					}
				} else {
					callback(Errors.networkError("A00133"), null);
				}
			}, (error: HttpErrorResponse): void => {
				callback(Errors.networkException(error, "A00134"), null);
			});
		} else {
			callback(Errors.generalError(-1, "'username' required.", "A00143"), null);
		}
	}

	/**
	 *
	 * @param user_id
	 * @param callback
	 */
	public reset_2fa(user_id: string, callback: Callback<any>): void {
		if (user_id) {
			this.http.post(this.endPoint + "/accounts/auth/reset2fa/" + encodeURIComponent(user_id), {}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
				if (result) {
					if (result.code === 0) {
						callback(null, result.value);
					} else {
						callback(Errors.serverError(result, "A00135"), null);
					}
				} else {
					callback(Errors.networkError("A00136"), null);
				}
			}, (error: HttpErrorResponse): void => {
				callback(Errors.networkException(error, "A00137"), null);
			});
		} else {
			callback(Errors.generalError(-1, "'user_id' required.", "A00143"), null);
		}
	}

	/*
	* relation
	* */
	public make_relation(to: string, type: string, callback: Callback<any>): void {
		if (to) {
			if (type) {
				this.http.post(this.endPoint + '/accounts/relation', {to: to, type: type}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00138"), null);
						}
					} else {
						callback(Errors.networkError("A00139"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00140"), null);
				});
			} else {
				callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'to' required.", "A00143"), null);
		}
	}

	/*
	* relation to
	* */
	public make_relation_to(from: string, to: string, type: string, callback: Callback<any>): void {
		if (from) {
			if (to) {
				if (type) {
					this.http.post(this.endPoint + '/accounts/relation/to', {from: from, to: to, type: type}, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
						if (result) {
							if (result.code === 0) {
								callback(null, result.value);
							} else {
								callback(Errors.serverError(result, "A00138"), null);
							}
						} else {
							callback(Errors.networkError("A00139"), null);
						}
					}, (error: HttpErrorResponse): void => {
						callback(Errors.networkException(error, "A00140"), null);
					});
				} else {
					callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
				}
			} else {
				callback(Errors.generalError(-1, "'to' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'from' required.", "A00143"), null);
		}
	}

	/*
	* relation元一覧
	* */
	public relation_from(type: string, option: any, callback: Callback<{ account: any, enabled: boolean, from_id: any, to_id: any, type: string }[]>): void {
		if (type) {
			if (option) {
				this.http.get(this.endPoint + "/accounts/relation/from/" + encodeURIComponent(type) + "/" + encodeURIComponent(JSON.stringify(option)), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (Array.isArray(result)) {
							callback(null, result);
						} else {
							callback(Errors.networkError("A00341"), null);
						}
					} else {
						callback(Errors.networkError("A00141"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00142"), null);
				});
			} else {
				callback(Errors.generalError(-1, "'option' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
		}
	}

	/*
	* relation先一覧
	* */
	public relation_to(type: string, option: any, callback: Callback<{ account: any, enabled: boolean, from_id: any, to_id: any, type: string }[]>): void {
		if (type) {
			if (option) {
				this.http.get(this.endPoint + "/accounts/relation/to/" + encodeURIComponent(type) + "/" + encodeURIComponent(JSON.stringify(option)), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (Array.isArray(result)) {
							callback(null, result);
						} else {
							callback(Errors.networkError("A00341"), null);
						}
					} else {
						callback(Errors.networkError("A00143"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00144"), null);
				});
			} else {
				callback(Errors.generalError(-1, "'option' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
		}
	}

	/*
	* relation元一覧
	* */
	public relation_from_user(username: string, type: string, option: any, callback: Callback<{ account: any, enabled: boolean, from_id: any, to_id: any, type: string }[]>): void {
		if (username) {
			if (type) {
				if (option) {
					this.http.get(this.endPoint + "/accounts/relation/fromuser/" + encodeURIComponent(username) + "/" + encodeURIComponent(type) + "/" + encodeURIComponent(JSON.stringify(option)), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
						if (result) {
							if (Array.isArray(result)) {
								callback(null, result);
							} else {
								callback(Errors.networkError("A00341"), null);
							}
						} else {
							callback(Errors.networkError("A00141"), null);
						}
					}, (error: HttpErrorResponse): void => {
						callback(Errors.networkException(error, "A00142"), null);
					});
				} else {
					callback(Errors.generalError(-1, "'option' required.", "A00143"), null);
				}
			} else {
				callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'username' required.", "A00143"), null);
		}
	}

	/*
	* relation先一覧
	* */
	public relation_to_user(username: string, type: string, option: any, callback: Callback<{ account: any, enabled: boolean, from_id: any, to_id: any, type: string }[]>): void {
		if (username) {
			if (type) {
				if (option) {
					this.http.get(this.endPoint + "/accounts/relation/touser/" + encodeURIComponent(username) + "/" + encodeURIComponent(type) + "/" + encodeURIComponent(JSON.stringify(option)), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
						if (result) {
							if (Array.isArray(result)) {
								callback(null, result);
							} else {
								callback(Errors.networkError("A00341"), null);
							}
						} else {
							callback(Errors.networkError("A00143"), null);
						}
					}, (error: HttpErrorResponse): void => {
						callback(Errors.networkException(error, "A00144"), null);
					});
				} else {
					callback(Errors.generalError(-1, "'option' required.", "A00143"), null);
				}
			} else {
				callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'username' required.", "A00143"), null);
		}
	}

	/*
	* relation要求却下
	* */
	public reject_relation(from: string, type: string, callback: Callback<any>): void {
		if (from) {
			if (type) {
				this.http.delete(this.endPoint + '/accounts/relation/reject/' + encodeURIComponent(from) + "/" + encodeURIComponent(type), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00145"), null);
						}
					} else {
						callback(Errors.networkError("A00146"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00147"), null);
				});
			} else {
				callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'from' required.", "A00143"), null);
		}
	}

	/*
	* relationキャンセル
	* */
	public cancel_relation(to: string, type: string, callback: Callback<any>): void {
		if (to) {
			if (type) {
				this.http.delete(this.endPoint + '/accounts/relation/cancel/' + encodeURIComponent(to) + "/" + encodeURIComponent(type), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00148"), null);
						}
					} else {
						callback(Errors.networkError("A00149"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00150"), null);
				});
			} else {
				callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'to' required.", "A00143"), null);
		}
	}

	/*
	* relation双方向削除
	* */
	public break_relation(to: string, type: string, callback: Callback<any>): void {
		if (to) {
			if (type) {
				this.http.delete(this.endPoint + '/accounts/relation/remove/' + encodeURIComponent(to) + "/" + encodeURIComponent(type), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00151"), null);
						}
					} else {
						callback(Errors.networkError("A00152"), null);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00153"), null);
				});
			} else {
				callback(Errors.generalError(-1, "'type' required.", "A00143"), null);
			}
		} else {
			callback(Errors.generalError(-1, "'to' required.", "A00143"), null);
		}
	}

}
