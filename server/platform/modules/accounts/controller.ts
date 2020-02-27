/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {
	IAccountContent,
	IAccountModel,
	IAccountRequest,
	IJSONResponse,
	IQueryParam,
	IQueryRequest,
	IUserIDParam,
	IUsernameParam,
} from "../../../../types/platform/server";

const _: any = require("lodash");
const SpeakEasy: any = require("speakeasy");
const QRCode: any = require("qrcode");

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;

const Wrapper: any = require(path.join(controllers, "wrapper"));
const LocalAccount: any = require(path.join(models, "platform/accounts/account"));

/**
 *
 */
export class Accounts extends Wrapper {

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
	}

	/**
	 *
	 * @param current
	 * @param username
	 */
	private own(current: any, username: string): boolean {
		// マネージャ以上は、自分以外のアカウントを変更できる。
		let readable: boolean = false;
		if (current.role.manager) { // is not manager?
			readable = true;
		} else {
			readable = (current.username === username); // is self?
		}
		return readable;
	}

	/**
	 *
	 * @param current
	 * @param username
	 */
	private own_by_id(current: any, user_id: string): boolean {
		// マネージャ以上は、自分以外のアカウントを変更できる。
		let readable: boolean = false;
		if (current.role.manager) { // is not manager?
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
			const current_user: IAccountModel = this.Transform(request.user);
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					this.Decode(params.option, (error: IErrorObject, option: IQueryOption): void => {
						this.ifSuccess(response, error, (): void => {
							if (option.limit) {
								if (option.limit === 0) {
									delete option.limit;
								}
							}
							const default_query: object = {$and: [query, {auth: {$gte: current_user.auth}}]};
							LocalAccount.default_find(current_user, default_query, option, (error: IErrorObject, accounts: IAccountModel[]): void => {
								this.ifSuccess(response, error, (): void => {
									const result: object[] = [];
									accounts.forEach((account) => {
										result.push(account.public());
									});
									this.SendRaw(response, result);
								});
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
			const current_user: IAccountModel = this.Transform(request.user);
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					const q: object = {$and: [query, {auth: {$gte: current_user.role.raw}}]};
					LocalAccount.default_find(current_user, q, {}, (error: IErrorObject, accounts: IAccountModel[]): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, accounts.length);
						});
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
				const params: IUsernameParam = request.params;
				const current_user: IAccountModel = this.Transform(request.user);

				if (this.own(current_user, params.username)) {
					LocalAccount.default_find_by_name(current_user, params.username, (error: IErrorObject, account: IAccountModel): void => {
						this.ifSuccess(response, error, (): void => {
							if (account) {
								// this.SendSuccess(response, account.public(current_user));
								this.SendSuccess(response, account.public());
							} else {
								this.SendWarn(response, {code: 3, message: "not found"});
							}
						});
					});
				} else {
					this.SendError(response, {code: 2, message: "unreadable.(account 2)"});
				}
			} else {
				this.SendError(response, {code: 1, message: "not logged in.(account 1)"});
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
				const params: IUsernameParam = request.params;
				const current_user: IAccountModel = this.Transform(request.user);
				const content: IAccountContent = request.body.content;

				const update: any = {
					"content.mails": content.mails,
					"content.nickname": content.nickname,
					"content.id": content.id,
					"content.description": content.description,
				};

				if (current_user.role.raw <= content.auth) {
					update.auth = content.auth;
					update.enabled = content.enabled;
				}

				if (this.own(current_user, params.username)) {
					LocalAccount.set_by_name(current_user, params.username, update, (error: IErrorObject, account: IAccountModel): void => {
						this.ifSuccess(response, error, (): void => {
							// 		this.SendSuccess(response, object.public(current_user));
							this.SendSuccess(response, account.public());
						});
					});
				} else {
					this.SendError(response, {code: 2, message: "unreadable.(account 1)"});
				}
			} else {
				this.SendError(response, {code: 1, message: "not logged in.(account 2)"});
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
			const params: IUsernameParam = request.params;
			const current_user: IAccountModel = this.Transform(request.user);

			if (this.own(current_user, params.username)) {
				LocalAccount.default_find_by_name(current_user, params.username, (error: IErrorObject, account: IAccountModel): void => {
					this.ifSuccess(response, error, (): void => {
						LocalAccount.remove_by_name(current_user, params.username, (error: IErrorObject): void => {
							this.ifSuccess(response, error, (): void => {
								// this.event.emitter.emit("account:delete", {user: current_user, user_id: object.user_id, username: object.username});
								this.SendSuccess(response, {});
							});
						});
					});
				});
			} else {
				this.SendError(response, {code: 2, message: "unreadable.(account 2)"});
			}
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
			const params: IUsernameParam = request.params;
			const current_user: IAccountModel = this.Transform(request.user);
			const params_username: string = params.username;

			if (this.own(current_user, params.username)) {
				LocalAccount.default_find_by_name(current_user, params_username, (error: IErrorObject, account: IAccountModel): void => {
					this.ifSuccess(response, error, (): void => {
						const is_2fa: boolean = (account.secret !== "");
						this.SendSuccess(response, {is_2fa});
					});
				});
			} else {
				this.SendError(response, {code: 2, message: "unreadable.(account 3)"});
			}
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
			const params: IUsernameParam = request.params;
			const current_user: IAccountModel = this.Transform(request.user);
			const params_username: string = params.username;

			if (this.own(current_user, params.username)) {
				LocalAccount.default_find_by_name(current_user, params_username, (error: IErrorObject, account: IAccountModel): void => {
					this.ifSuccess(response, error, (): void => {
						if (!account.secret) {
							const secret: any = SpeakEasy.generateSecret({
								length: 20,
								name: params_username,
								issuer: this.systemsConfig.ua,
							});
							const update: object = {
								secret: secret.base32,
							};

							const qr_url: string = SpeakEasy.otpauthURL({ // data url encode of secret QR code.
								secret: secret.ascii,
								label: encodeURIComponent(usernameToMail(params_username)),
								issuer: this.systemsConfig.ua,
							});

							LocalAccount.set_by_name(current_user, params_username, update, (error: IErrorObject, account: object): void => {
								this.ifSuccess(response, error, (): void => {
									QRCode.toDataURL(qr_url, (error: IErrorObject, qrcode): void => {
										this.ifSuccess(response, error, (): void => {
											this.SendSuccess(response, {qrcode});
										});
									});
								});
							});
						}
					});
				});
			} else {
				this.SendError(response, {code: 2, message: "unreadable.(account 4)"});
			}
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
			const params: IUsernameParam = request.params;
			const current_user: IAccountModel = this.Transform(request.user);
			const params_username: string = params.username;

			if (this.own(current_user, params.username)) {
				const update: object = {
					secret: "",
				};
				LocalAccount.set_by_name(current_user, params_username, update, (error: IErrorObject, account: IAccountModel): void => {
					this.ifSuccess(response, error, (): void => {
						this.SendSuccess(response, {});
					});
				});
			} else {
				this.SendError(response, {code: 2, message: "unreadable.(account 5)"});
			}
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
				const params: IUserIDParam = request.params;
				const current_user: IAccountModel = this.Transform(request.user);

				if (this.own_by_id(current_user, params.user_id)) {
					LocalAccount.default_find_by_id(current_user, params.user_id, (error: IErrorObject, account: IAccountModel): void => {
						this.ifSuccess(response, error, (): void => {
							if (account) {
								// this.SendSuccess(response, account.public(current_user));
								this.SendSuccess(response, account.public());
							} else {
								this.SendWarn(response, {code: 3, message: "not found"});
							}
						});
					});
				} else {
					this.SendError(response, {code: 2, message: "unreadable.(account 6)"});
				}
			} else {
				this.SendError(response, {code: 1, message: "not logged in.(account 3)"});
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
				const params: IUserIDParam = request.params;
				const current_user: IAccountModel = this.Transform(request.user);
				const content: IAccountContent = request.body.content;

				const update: any = {
					"content.mails": content.mails,
					"content.nickname": content.nickname,
					"content.id": content.id,
					"content.description": content.description,
				};

				if (current_user.role.raw <= content.auth) {
					update.auth = content.auth;
					update.enabled = content.enabled;
				}

				if (this.own_by_id(current_user, params.user_id)) {
					LocalAccount.set_by_id(current_user, params.user_id, update, (error: IErrorObject, account: IAccountModel): void => {
						this.ifSuccess(response, error, (): void => {
							// 		this.SendSuccess(response, object.public(current_user));
							this.SendSuccess(response, account.public());
						});
					});
				} else {
					this.SendError(response, {code: 2, message: "unreadable.(account 7)"});
				}
			} else {
				this.SendError(response, {code: 1, message: "not logged in.(account 1)"});
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
			const params: IUserIDParam = request.params;
			const current_user: IAccountModel = this.Transform(request.user);

			if (this.own_by_id(current_user, params.user_id)) {
				LocalAccount.default_find_by_id(current_user, params.user_id, (error: IErrorObject, account: IAccountModel): void => {
					this.ifSuccess(response, error, (): void => {
						LocalAccount.remove_by_id(current_user, params.user_id, (error: IErrorObject): void => {
							this.ifSuccess(response, error, (): void => {
								// this.event.emitter.emit("account:delete", {user: current_user, user_id: object.user_id, username: object.username});
								this.SendSuccess(response, {});
							});
						});
					});
				});
			} else {
				this.SendError(response, {code: 2, message: "unreadable.(account 8)"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}


}

module.exports = Accounts;
