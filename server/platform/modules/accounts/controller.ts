/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {IAccountContent, IAccountModel, IAccountRequest, IJSONResponse, IQueryParam, IQueryRequest, IUsernameParam} from "../../../../types/platform/server";
import * as mongoose from "mongoose";
import {Errors} from "../../base/library/errors";

const SpeakEasy: any = require("speakeasy");
const QRCode: any = require("qrcode");

const Wrapper: any = require("../../../../server/platform/base/controllers/wrapper");
const LocalAccount: any = require("../../../../models/platform/accounts/account");
const Relation: any = require('../../../../models/platform/relations/relation');

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
	constructor(event: any, config: any, logger: any) {
		super(event, config, logger);
		this.message = this.systemsConfig.message;

		event.on("compaction", () => {
			logger.info("start compaction Accounts");
		});
	}

	/**
	 *
	 * @param current
	 * @param username
	 * @returns own
	 */
	private static own_by_name(current: any, username: string): boolean {
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
	private static from_aggregater(aggregater: any[], user_id: mongoose.Types.ObjectId, type: string): void {
		aggregater.push({$match: {$and: [{to_id: user_id}, {type: type}]}});
		aggregater.push({$lookup: {from: 'accounts', localField: 'from_id', foreignField: 'user_id', as: 'lookup_account'}});
		aggregater.push({$addFields: {account: {$arrayElemAt: ["$lookup_account", 0]}}});
		aggregater.push({
			$project: {
				"lookup_account": 0,
				"account._id": 0,
				"account.publickey": 0,
				"account.privatekey": 0,
				"account.secret": 0,
				"account.salt": 0,
				"account.hash": 0,
			}
		});
	}

	private static to_aggregater(aggregater: any[], user_id: mongoose.Types.ObjectId, type: string): void {
		aggregater.push({$match: {$and: [{from_id: user_id}, {type: type}]}});
		aggregater.push({$lookup: {from: 'accounts', localField: 'to_id', foreignField: 'user_id', as: 'lookup_account'}});
		aggregater.push({$addFields: {account: {$arrayElemAt: ["$lookup_account", 0]}}});
		aggregater.push({
			$project: {
				"lookup_account": 0,
				"account._id": 0,
				"account.publickey": 0,
				"account.privatekey": 0,
				"account.secret": 0,
				"account.salt": 0,
				"account.hash": 0,
			}
		});
	}

	private static option_aggregater(aggregater: any[], option: IQueryOption): void {
		if (option.sort) {
			if (Object.keys(option.sort).length > 0) {
				aggregater.push({$sort: option.sort});
			}
		}

		if (option.skip) {
			aggregater.push({$skip: option.skip});
		}

		if (option.limit) {
			aggregater.push({$limit: option.limit});
		}
	}

	/**
	 * アカウント検索
	 * @param request
	 * @param response
	 * @returns none
	 */
	public query(request: IQueryRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00206"), request.user, () => {
				const params: IQueryParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00207"), operator.login, () => {
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
									LocalAccount.default_find(operator, default_query, option).then((accounts: IAccountModel[]): void => {

										const result: object[] = [];
										accounts.forEach((account) => {
											result.push(account.public());
										});
										this.SendRaw(response, result);

									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S10030"));
									})
								});
							});
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10031"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00208"), request.user, () => {
				const params: IQueryParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00209"), operator.login, () => {
					this.Decode(params.query, (error: IErrorObject, query: object): void => {
						this.ifSuccess(response, error, (): void => {
							const filtered_by_auth: object = {$and: [query, {auth: {$gte: operator.auth}}]};
							LocalAccount.default_find(operator, filtered_by_auth, {}).then((accounts: IAccountModel[]): void => {
								this.SendSuccess(response, accounts.length);
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S10032"));
							})
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10033"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00300"), request.user, () => {
				const target: IUsernameParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00301"), operator.login, () => {
					if (Accounts.own_by_name(operator, target.username)) {
						LocalAccount.default_find_by_name(operator, target.username).then((account: IAccountModel): void => {
							this.ifExist(response, Errors.generalError(-1, "no user.", "S00302"), account, () => {
								this.SendSuccess(response, account.public());
							});
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S10034"));
						})
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00303"));
					}
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10036"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00304"), request.user, () => {
				const target: IUsernameParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				const type: string = request.body.type;
				const content: IAccountContent = request.body.content;
				this.ifExist(response, Errors.generalError(1, "no content.", "S00305"), (operator && content), () => {

					const update: any = {
						"type": type,
						"content.mails": content.mails,
						"content.nickname": content.nickname,
						"content.id": content.id,
						"content.description": content.description,
					};

					if (operator.auth <= content.auth) {
						update.auth = content.auth;
						update.enabled = content.enabled;
					}

					this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00306"), operator.login, () => {
						if (Accounts.own_by_name(operator, target.username)) {
							LocalAccount.set_by_name(operator, target.username, update).then((account: IAccountModel): void => {
								this.SendSuccess(response, account.public());
							}).catch((error: any) => {
								this.SendError(response, Errors.Exception(error, "S10037"));
							})
						} else {
							this.SendError(response, Errors.generalError(2, "unreadable.", "S00307"));
						}
					});
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10026"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00308"), request.user, () => {
				const target: IUsernameParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00309"), operator.login, () => {
					if (Accounts.own_by_name(operator, target.username)) {
						LocalAccount.default_find_by_name(operator, target.username).then((account: IAccountModel): void => {
							this.ifExist(response, Errors.generalError(-1, "not found.", "S00310"), account, () => {
								Relation.delete(account.user_id).then((result: any) => {
									LocalAccount.remove_by_name(operator, target.username).then((): void => {
										this.SendSuccess(response, {});
									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S10027"));
									})
								}).catch((error: IErrorObject) => {
									this.SendError(response, Errors.Exception(error, "S00353"));
								})
							});
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S10028"));
						})
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00311"));
					}
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10002"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00312"), request.user, () => {
				const target: IUsernameParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00313"), operator.login, () => {
					if (Accounts.own_by_name(operator, target.username)) {
						LocalAccount.default_find_by_name(operator, target.username).then((account: IAccountModel): void => {
							this.ifExist(response, Errors.generalError(-1, "no user.", "S00314"), account, () => {
								const is_2fa: boolean = (account.secret !== "");
								this.SendSuccess(response, {is_2fa});
							})
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S10003"));
						});
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00315"));
					}
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10004"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00316"), request.user, () => {
				const target: IUsernameParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00317"), operator.login, () => {
					if (Accounts.own_by_name(operator, target.username)) {
						LocalAccount.default_find_by_name(operator, target.username).then((account: IAccountModel): void => {
							this.ifExist(response, Errors.generalError(-1, "no user.", "S00318"), account, () => {
								this.ifExist(response, Errors.generalError(-1, "Already Multi-factor authentication.", "S00319"), !Boolean(account.secret), () => {
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

									LocalAccount.set_by_name(operator, target.username, update).then((account: object): void => {
										QRCode.toDataURL(qr_url, (error: IErrorObject, qrcode: any): void => {
											this.ifSuccess(response, error, (): void => {
												this.SendSuccess(response, {qrcode});
											});
										});
									}).catch((error: any) => {
										this.SendError(response, Errors.Exception(error, "S10005"));
									})
								});
							});
						}).catch((error: any) => {
							this.SendError(response, Errors.Exception(error, "S10006"));
						})
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00320"));
					}
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10016"));
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00321"), request.user, () => {
				const target: IUsernameParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00322"), operator.login, () => {
					LocalAccount.default_find_by_name(operator, target.username).then((account: IAccountModel): void => {
						this.ifExist(response, Errors.generalError(-1, "no user.", "S00323"), account, () => {
							if (Accounts.own_by_name(operator, target.username)) {
								const update: object = {
									secret: "",
								};
								LocalAccount.set_by_name(operator, target.username, update).then((account: IAccountModel): void => {
									this.ifExist(response, Errors.generalError(-1, "no user.", "S00324"), account, () => {
										this.SendSuccess(response, {});
									});
								}).catch((error: any) => {
									this.SendError(response, error);
								})
							} else {
								this.SendError(response, Errors.generalError(2, "unreadable.", "S00325"));
							}
						});
					}).catch((error: any) => {
						this.SendError(response, Errors.Exception(error, "S10027"));
					})
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S10026"));
		}
	}

	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @returns none
	 */
	/*
	public get_by_id(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.generalError( 1,  "ログインしていません." , "00001"), request.user, () => {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.generalError( 1,  "ログインしていません." , "00001"), operator.login, () => {
					if (Accounts.own_by_id(operator, target.user_id)) {
						LocalAccount.default_find_by_id(operator, target.user_id).then((account: IAccountModel): void => {
							this.ifExist(response, {code: -1, message: "no user."}, account, () => {
								this.SendSuccess(response, account.public());
							});
						}).catch((error: IErrorObject) => {
							this.SendError(response, error);
						})
					} else {
						this.SendError(response, {code: 2, message: "unreadable. 9360"});
					}
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}
*/
	/**
	 * アカウントプット
	 * @param request
	 * @param response
	 * @returns none
	 */
	/*
	public put_by_id(request: IAccountRequest<IAccountContent>, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.generalError( 1,  "ログインしていません." ,                  "00001"), request.user, () => {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				const content: IAccountContent = request.body.content;
				this.ifExist(response, {code: 1, message: "no content. 1657"}, (operator && content), () => {
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
					this.ifExist(response, Errors.generalError( 1,  "ログインしていません." ,                  "00001"), operator.login, () => {
						if (Accounts.own_by_id(operator, target.user_id)) {
							LocalAccount.set_by_id(operator, target.user_id, update).then((account: IAccountModel): void => {
								this.SendSuccess(response, account.public());
							}).catch((error: any) => {
								this.SendError(response, error);
							})
						} else {
							this.SendError(response, {code: 2, message: "unreadable. 3818"});
						}
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}
*/
	/**
	 * アカウント削除
	 * @param request
	 * @param response
	 * @returns none
	 */

	/*
	public delete_by_id(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.generalError( 1,  "ログインしていません." ,                  "00001"), request.user, () => {
				const target: IUserIDParam = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.generalError( 1,  "ログインしていません." ,                  "00001"), operator.login, () => {
					if (Accounts.own_by_id(operator, target.user_id)) {
						LocalAccount.default_find_by_id(operator, target.user_id).then((account: IAccountModel): void => {
							this.ifExist(response, {code: -1, message: "no user."}, account, () => {
								LocalAccount.remove_by_id(operator, target.user_id).then((): void => {
									this.SendSuccess(response, {});
								}).catch((error: any) => {
									this.SendError(response, error);
								});
							});
						}).catch((error: any) => {
							this.SendError(response, error);
						})
					} else {
						this.SendError(response, {code: 2, message: "unreadable. 2245"});
					}
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}
*/

	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_self(request: IAccountRequest<any>, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00326"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00327"), operator.login, () => {
					LocalAccount.default_find_by_id(operator, operator.user_id).then((account: IAccountModel): void => {
						this.ifExist(response, Errors.generalError(-1, "no user.", "S00328"), account, () => {
				// 			this.SendSuccess(response, account.content);
							this.SendSuccess(response, account.public());
						});
					}).catch((error: any) => {
						this.SendError(response, error);
					})
				});
			});
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
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00329"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				const content: any = request.body;

				const update: any = {
					"content.nickname": content.nickname,
					"content.description": content.description,
					"content.id": content.id,
					"content.mails": content.mails,
				};
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00330"), operator.login, () => {
					LocalAccount.set_by_id(operator, operator.user_id, update).then((account: IAccountModel): void => {
						this.ifExist(response, Errors.generalError(-1, "no user.", "S00331"), account, () => {
							this.SendSuccess(response, account.content);
						});
					}).catch((error: any) => {
						this.SendError(response, error);
					})
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * リレーション
	 * @param request
	 * @param response
	 * @returns none
	 */
	public make_relation(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00332"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				const from_user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(operator.user_id);
				const type: string = request.body.type;
				const target_user_name: string = request.body.to;
				LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
					if (target_user) { //
						const to_user_id: mongoose.Types.ObjectId = target_user.user_id;
						if (!from_user_id.equals(to_user_id)) { // 自己
							Relation.related(from_user_id, to_user_id, type).then((result: any) => {
								if (!result) {
									const relation: any = new Relation();
									relation.from_id = from_user_id;
									relation.to_id = to_user_id;
									relation.type = type;
									relation.save().then((result: any) => {
										this.SendSuccess(response, result);
									}).catch((error: IErrorObject) => {
										this.SendError(response, error);
									})
								} else {
									this.SendSuccess(response, result);
							// 		this.SendError(response, Errors.generalError(1, "already.", "S00333"));
								}
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S00334"));
							})
						} else {
							this.SendError(response, Errors.generalError(1, 'same.', "S00335"));
						}
					} else {
						this.SendError(response, Errors.generalError(1, 'no user.', "S00336"));
					}
				}).catch((error: any) => {
					this.SendError(response, Errors.Exception(error, "S00337"));
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00338"));
		}
	}

	/**
	 * リレーション
	 * @param request
	 * @param response
	 * @returns none
	 */
	public make_relation_to(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00332"), request.user, () => {
				const type: string = request.body.type;
				const source_user_name: string = request.body.from;
				LocalAccount.default_find_by_name(null, source_user_name).then((source_user: any) => {
					if (source_user) { //
						const from_user_id: mongoose.Types.ObjectId = source_user.user_id;
						const target_user_name: string = request.body.to;
						LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
							if (target_user) { //
								const to_user_id: mongoose.Types.ObjectId = target_user.user_id;
								if (!from_user_id.equals(to_user_id)) { // 自己
									Relation.related(from_user_id, to_user_id, type).then((result: any) => {
										if (!result) {
											const relation: any = new Relation();
											relation.from_id = from_user_id;
											relation.to_id = to_user_id;
											relation.type = type;
											relation.save().then((result: any) => {
												this.SendSuccess(response, result);
											}).catch((error: IErrorObject) => {
												this.SendError(response, error);
											})
										} else {
											this.SendError(response, Errors.generalError(1, "already.", "S00333"));
										}
									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S00334"));
									})
								} else {
									this.SendError(response, Errors.generalError(1, 'same.', "S00335"));
								}
							} else {
								this.SendError(response, Errors.generalError(1, 'no user.', "S00336"));
							}
						}).catch((error: any) => {
							this.SendError(response, Errors.Exception(error, "S00337"));
						});
					} else {
						this.SendError(response, Errors.generalError(1, 'no user.', "S00336"));
					}
				}).catch((error: any) => {
					this.SendError(response, Errors.Exception(error, "S00337"));
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00338"));
		}
	}

	/**
	 * リレーション
	 * @param request
	 * @param response
	 * @returns none
	 */
	public relation_from(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00339"), request.user, () => {
				const params = request.params;
				const operator: IAccountModel = this.Transform(request.user);

				const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(operator.user_id);
				const type: string = params.type;
				const option: IQueryOption = params.option;

				const aggregater: any[] = [];

				Accounts.from_aggregater(aggregater, user_id, type);

				Accounts.option_aggregater(aggregater, option);

				Relation.aggregate(aggregater).then((results: any[]): void => {
					this.SendRaw(response, results);
				}).catch((error: IErrorObject) => {
					this.SendError(response, error);
				});

			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * リレーション
	 * @param request
	 * @param response
	 * @returns none
	 */
	public relation_to(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00340"), request.user, () => {
				const params = request.params;
				const operator: IAccountModel = this.Transform(request.user);
				const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(operator.user_id);
				const type: string = params.type;
				const option: IQueryOption = params.option;

				const aggregater: any[] = [];

				Accounts.to_aggregater(aggregater, user_id, type);

				Accounts.option_aggregater(aggregater, option);

				Relation.aggregate(aggregater).then((results: any[]): void => {
					this.SendRaw(response, results);
				}).catch((error: IErrorObject) => {
					this.SendError(response, error);
				});

			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * リレーション
	 * @param request
	 * @param response
	 * @returns none
	 */
	public relation_from_user(request: any, response: any): void {
		try {
				this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00341"), request.user, () => {
					const params = request.params;
					const target_user_name: string = params.username;
					const type: string = params.type;
					const option: IQueryOption = params.option;

					LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
						if (target_user) {
							const user_id = target_user.user_id;

							const aggregater: any[] = [];

							Accounts.from_aggregater(aggregater, user_id, type);

							Accounts.option_aggregater(aggregater, option);

							Relation.aggregate(aggregater).then((results: any[]): void => {
								this.SendRaw(response, results);
							}).catch((error: IErrorObject) => {
								this.SendError(response, error);
							});

						} else {
							this.SendError(response, Errors.generalError(1, 'no user', "S00344"));
						}
					}).catch((error: any) => {
						this.SendError(response, Errors.Exception(error, "S00345"));
					});
				});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * リレーション
	 * @param request
	 * @param response
	 * @returns none
	 */
	public relation_to_user(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00341"), request.user, () => {
				const params = request.params;
				const target_user_name: string = params.username;
				const type: string = params.type;
				const option: IQueryOption = params.option;

				LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
					if (target_user) {
						const user_id = target_user.user_id;

						const aggregater: any[] = [];

						Accounts.to_aggregater(aggregater, user_id, type);

						Accounts.option_aggregater(aggregater, option);

						Relation.aggregate(aggregater).then((results: any[]): void => {
							this.SendRaw(response, results);
						}).catch((error: IErrorObject) => {
							this.SendError(response, error);
						});

					} else {
						this.SendError(response, Errors.generalError(1, 'no user', "S00344"));
					}
				}).catch((error: any) => {
					this.SendError(response, Errors.Exception(error, "S00345"));
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * to方向リレーション削除
	 * @param request
	 * @param response
	 * @returns none
	 */
	public reject_relation(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00341"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				const from_user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(operator.user_id);
				const target_user_name: string = request.params.username;
				const type: string = request.params.type;
				LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
					if (target_user) {
						const to_user_id: mongoose.Types.ObjectId = target_user.user_id;
						Relation.cancel(to_user_id, from_user_id, type).then((result: any) => {
							if (result) {
								this.SendSuccess(response, result);
							} else {
								this.SendError(response, Errors.generalError(1, 'target user not found.', "S00342"));
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00343"));
						})
					} else {
						this.SendError(response, Errors.generalError(1, 'no user', "S00344"));
					}
				}).catch((error: any) => {
					this.SendError(response, Errors.Exception(error, "S00345"));
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * to方向リレーション削除
	 * @param request
	 * @param response
	 * @returns none
	 */
	public cancel_relation(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00346"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				const from_user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(operator.user_id);
				const target_user_name: string = request.params.username;
				const type: string = request.params.type;
				LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
					if (target_user) {
						const to_user_id: mongoose.Types.ObjectId = target_user.user_id;
						Relation.cancel(from_user_id, to_user_id, type).then((result: any) => {
							if (result) {
								this.SendSuccess(response, result);
							} else {
								this.SendError(response, Errors.generalError(-1, 'target user not found.', "S00347"));
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00348"));
						})
					} else {
						this.SendError(response, Errors.generalError(1, 'no user', "S00349"));
					}
				}).catch((error: any) => {
					this.SendError(response, Errors.Exception(error, "S00350"));
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00351"));
		}
	}

	/**
	 * 双方リレーション削除
	 * @param request
	 * @param response
	 * @returns none
	 */
	public break_relation(request: any, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "ログインしていません.", "S00377"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				const from_user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(operator.user_id);
				const target_user_name: string = request.params.username;
				const type: string = request.params.type;
				LocalAccount.default_find_by_name(null, target_user_name).then((target_user: any) => {
					if (target_user) {
						const to_user_id: mongoose.Types.ObjectId = target_user.user_id;
						Relation.break(from_user_id, to_user_id, type).then((result: any) => {
							if (result) {
								this.SendSuccess(response, result);
							} else {
								this.SendError(response, Errors.generalError(1, 'target user not found.', "S00352"));
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00353"));
						})
					} else {
						this.SendError(response, Errors.generalError(1, 'no user', "S00354"));
					}
				}).catch((error: any) => {
					this.SendError(response, Errors.Exception(error, "S00355"));
				});
			});
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00356"));
		}
	}
}

module.exports = Accounts;
