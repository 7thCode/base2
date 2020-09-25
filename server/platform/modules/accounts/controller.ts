/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {IAccountContent, IAccountModel, IAccountRequest, IJSONResponse, IQueryParam, IQueryRequest, IUserIDParam, IUsernameParam,} from "../../../../types/platform/server";

const SpeakEasy: any = require("speakeasy");
const QRCode: any = require("qrcode");

const Wrapper: any = require("../../../../server/platform/base/controllers/wrapper");
const LocalAccount: any = require("../../../../models/platform/accounts/account");

/**
 *
 */
export class Accounts extends Wrapper {

	private readonly message: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
		this.message = this.systemsConfig.message;
	}

	/**
	 *
	 * @param current
	 * @param username
	 * @returns own
	 */
	private own_by_name(current: any, username: string): boolean {
		// マネージャ以上は、自分以外のアカウントを変更できる。
		let readable: boolean = false;
		if (current.auth < AuthLevel.user) { // is not manager?
			readable = true;
		} else {
			readable = (current.username === username); // is self?
		}
		return readable;
	}

	/**
	 *
	 * @param current
	 * @param user_id
	 * @returns own
	 */
	private own_by_id(current: any, user_id: string): boolean {
		// マネージャ以上は、自分以外のアカウントを変更できる。
		let readable: boolean = false;
		if (current.auth < AuthLevel.user) { // is not manager?
			readable = true;
		} else {
			readable = (current.user_id === user_id); // is self?
		}
		return readable;
	}

	/**
	 * アカウント検索
	 * @param request
	 * @param response
	 * @returns none
	 */
	public query(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				this.Decode(params.query, (error: IErrorObject, query: object): void => {
					this.ifSuccess(response, error, (): void => {
						this.Decode(params.option, (error: IErrorObject, option: IQueryOption): void => {
							this.ifSuccess(response, error, (): void => {
								if (option.limit) {
									if (option.limit === 0) {
										delete option.limit;
									}
								}
								const default_query: object = {$and: [query, {auth: {$gte: operator.auth}}]};
								LocalAccount.default_find_promise(operator, default_query, option).then((accounts: IAccountModel[]): void => {

									const result: object[] = [];
									accounts.forEach((account) => {
										result.push(account.public());
									});
									this.SendRaw(response, result);

								}).catch((error: IErrorObject) => {
									this.SendError(response, error);
								})
							});
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントカウント
	 * @param request
	 * @param response
	 * @returns none
	 */
	public count(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				this.Decode(params.query, (error: IErrorObject, query: object): void => {
					this.ifSuccess(response, error, (): void => {
						const q: object = {$and: [query, {auth: {$gte: operator.auth}}]};
						LocalAccount.default_find_promise(operator, q, {}).then((accounts: IAccountModel[]): void => {
							this.SendSuccess(response, accounts.length);
						}).catch((error: IErrorObject) => {
							this.SendError(response, error);
						})
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			if (request.user) {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
					if (this.own_by_id(operator, target.user_id)) {
						LocalAccount.default_find_by_id_promise(operator, target.user_id).then((account: IAccountModel): void => {
							if (account) {
								this.SendSuccess(response, account.public());
							} else {
								this.SendWarn(response, {code: 3, message: "not found. 3443"});
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, error);
						})
					} else {
						this.SendError(response, {code: 2, message: "unreadable. 9613"});
					}
				});
			} else {
				this.SendError(response, {code: 1, message: "not logged in. 3865"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントプット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public put(request: IAccountRequest<IAccountContent>, response: IJSONResponse): void {
		try {
			if (request.user) {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				const content: IAccountContent = request.body.content;

				const update: any = {
					"content.mails": content.mails,
					"content.nickname": content.nickname,
					"content.id": content.id,
					"content.description": content.description,
				};

				if (operator.auth <= content.auth) {
					update.auth = content.auth;
					update.enabled = content.enabled;
				}

				this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
					if (this.own_by_id(operator, target.user_id)) {
						LocalAccount.set_by_id_promise(operator, target.user_id, update).then((account: IAccountModel): void => {
							this.SendSuccess(response, account.public());
						}).catch((error: any) => {
							this.SendError(response, error);
						})
					} else {
						this.SendError(response, {code: 2, message: "unreadable. 8692"});
					}
				});

			} else {
				this.SendError(response, {code: 1, message: "not logged in. 8657"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウント削除
	 * @param request
	 * @param response
	 * @returns none
	 */
	public delete(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			const target: IUserIDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				if (this.own_by_id(operator, target.user_id)) {
					LocalAccount.default_find_by_id_promise(operator, target.user_id).then((account: IAccountModel): void => {
						LocalAccount.remove_by_id_promise(operator, target.user_id).then((): void => {
							this.SendSuccess(response, {});
						}).catch((error: IErrorObject) => {
							this.SendError(response, error);
						})
					}).catch((error: IErrorObject) => {
						this.SendError(response, error);
					})
				} else {
					this.SendError(response, {code: 2, message: "unreadable. 1618"});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_is_secret(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			const target: IUserIDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				if (this.own_by_id(operator, target.user_id)) {
					LocalAccount.default_find_by_id_promise(operator, target.user_id).then((account: IAccountModel): void => {
						const is_2fa: boolean = (account.secret !== "");
						this.SendSuccess(response, {is_2fa});
					}).catch((error: IErrorObject) => {
						this.SendError(response, error);
					});
				} else {
					this.SendError(response, {code: 2, message: "unreadable. 1209"});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_set_secret(request: IAccountRequest<any>, response: IJSONResponse): void {

		const usernameToMail = (username: string): string => {
			return username;
		};

		try {
			const target: IUsernameParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				if (this.own_by_name(operator, target.username)) {
					LocalAccount.default_find_by_name_promise(operator, target.username).then((account: IAccountModel): void => {

						if (!account.secret) {
							const secret: any = SpeakEasy.generateSecret({
								length: 20,
								name: target.username,
								issuer: this.systemsConfig.ua,
							});
							const update: object = {
								secret: secret.base32,
							};

							const qr_url: string = SpeakEasy.otpauthURL({ // data url encode of secret QR code.
								secret: secret.ascii,
								label: encodeURIComponent(usernameToMail(target.username)),
								issuer: this.systemsConfig.ua,
							});

							LocalAccount.set_by_name_promise(operator, target.username, update).then((account: object): void => {
								QRCode.toDataURL(qr_url, (error: IErrorObject, qrcode: any): void => {
									this.ifSuccess(response, error, (): void => {
										this.SendSuccess(response, {qrcode});
									});
								});
							}).catch((error: any) => {
								this.SendError(response, error);
							})
						}

					}).catch((error: any) => {
						this.SendError(response, error);
					})
				} else {
					this.SendError(response, {code: 2, message: "unreadable. 9927"});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_reset_secret(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			const target: IUsernameParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				if (this.own_by_name(operator, target.username)) {
					const update: object = {
						secret: "",
					};
					LocalAccount.set_by_name_promise(operator, target.username, update).then((account: IAccountModel): void => {
						this.SendSuccess(response, {});
					}).catch((error: any) => {
						this.SendError(response, error);
					})
				} else {
					this.SendError(response, {code: 2, message: "unreadable. 7639"});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_by_id(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			if (request.user) {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
					if (this.own_by_id(operator, target.user_id)) {
						LocalAccount.default_find_by_id_promise(operator, target.user_id).then((account: IAccountModel): void => {
							if (account) {
								this.SendSuccess(response, account.public());
							} else {
								this.SendWarn(response, {code: 3, message: "not found. 5674"});
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, error);
						})
					} else {
						this.SendError(response, {code: 2, message: "unreadable. 9360"});
					}
				});
			} else {
				this.SendError(response, {code: 1, message: "not logged in. 3917"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントプット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public put_by_id(request: IAccountRequest<IAccountContent>, response: IJSONResponse): void {
		try {
			if (request.user) {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				const content: IAccountContent = request.body.content;

				const update: any = {
					"content.mails": content.mails,
					"content.nickname": content.nickname,
					"content.id": content.id,
					"content.description": content.description,
				};

				if (operator.auth <= content.auth) {
					update.auth = content.auth;
					update.enabled = content.enabled;
				}

				this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
					if (this.own_by_id(operator, target.user_id)) {
						LocalAccount.set_by_id_promise(operator, target.user_id, update).then((account: IAccountModel): void => {
							this.SendSuccess(response, account.public());
						}).catch((error: any) => {
							this.SendError(response, error);
						})
					} else {
						this.SendError(response, {code: 2, message: "unreadable. 3818"});
					}
				});
			} else {
				this.SendError(response, {code: 1, message: "not logged in. 597"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウント削除
	 * @param request
	 * @param response
	 * @returns none
	 */
	public delete_by_id(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			const target: IUserIDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
				if (this.own_by_id(operator, target.user_id)) {
					LocalAccount.default_find_by_id_promise(operator, target.user_id).then((account: IAccountModel): void => {
						LocalAccount.remove_by_id_promise(operator, target.user_id).then((): void => {
							this.SendSuccess(response, {});
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					}).catch((error: any) => {
						this.SendError(response, error);
					})
				} else {
					this.SendError(response, {code: 2, message: "unreadable. 2245"});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_self(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			if (request.user) {
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
					LocalAccount.default_find_by_id_promise(operator, operator.user_id).then((account: IAccountModel): void => {
						if (account) {
							this.SendSuccess(response, account.content);
						} else {
							this.SendWarn(response, {code: 3, message: "not found. 3403"});
						}
					}).catch((error: any) => {
						this.SendError(response, error);
					})
				});
			} else {
				this.SendError(response, {code: 1, message: "not logged in. 3865"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * アカウントプット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public put_self(request: IAccountRequest<IAccountContent>, response: IJSONResponse): void {
		try {
			if (request.user) {
				const operator: IAccountModel = this.Transform(request.user);
				const content: any = request.body;

				const update: any = {
					"content.nickname": content.nickname,
					"content.description": content.description,
					"content.id": content.id,
					"content.mails": content.mails,
				};
				this.ifExist(response, {code: -1, message: "not loged in.."}, operator.login, () => {
					LocalAccount.set_by_id_promise(operator, operator.user_id, update).then((account: IAccountModel): void => {
						this.SendSuccess(response, account.content);
					}).catch((error: any) => {
						this.SendError(response, error);
					})
				});
			} else {
				this.SendError(response, {code: 1, message: "not logged in. 8257"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

}

module.exports = Accounts;
