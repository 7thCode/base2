/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject, IPasswordToken, IUserNameToken, IUserToken, StatusCallback} from "../../../../types/platform/universe";

import {IAccountModel, IContentRequest, IJSONResponse, ILoginRequest, IRedirectResponse, IUserIDParam, IUsernameParam, IUserRequest} from "../../../../types/platform/server";
import {Errors} from "../../base/library/errors";

const _: any = require("lodash");
const fs: any = require("graceful-fs");
const SpeakEasy: any = require("speakeasy");
const QRCode: any = require("qrcode");

const mongoose: any = require("mongoose");

const path: any = require("path");
const project_root: string = path.join(__dirname, "../../../..");

const _config: string = path.join(project_root, "config");

const Cipher: any = require("../../../../server/platform/base/library/cipher");
const Mail: any = require("../../../../server/platform/base/controllers/mail_controller");
const LocalAccount: any = require("../../../../models/platform/accounts/account");

export class Auth extends Mail {

	private readonly content: any = {mails: [], nickname: "", tokens: {}};
	private readonly passport: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @param passport
	 */
	constructor(event: any, config: object, logger: any, passport: object) {
		super(event, config, logger);
		this.passport = passport;

		event.on("compaction", () => {
			logger.info("start compaction Auth");
		});
	}

	/**
	 *
	 * @param key
	 * @param crypted
	 * @param callback
	 * @returns none
	 */
	private static publickey_decrypt(key: string, crypted: string, callback: Callback<any>): void {
		try {
			callback(null, Cipher.Decrypt(key, crypted));
		} catch (e) {
			callback(e, "");
		}
	}

	/**
	 *
	 * @param operator
	 * @param target
	 * manager以上は任意のユーザのパスワード変更可能
	 * それ以外は自身のパスワードのみ変更可能
	 */
	private static permit_for_change_account(operator: any, target: any): boolean {
		let result: boolean;
		if (operator.auth < AuthLevel.user) {
			result = true;
		} else {
			result = (operator.user_id === target.user_id)
		}
		return result;
	}

	/**
	 *
	 * @param e
	 */
	public static error_handler(e: IErrorObject) {
		this.logger.fatal(e.message);
	}

	/**
	 *
	 * @param use_publickey
	 * @param key
	 * @param crypted
	 * @param callback
	 * @returns none
	 */
	public static value_decrypt(use_publickey: boolean, key: string, crypted: any, callback: Callback<any>): void {
		try {
			if (use_publickey) {
				Auth.publickey_decrypt(key, crypted, (error, plain): void => {
					if (!error) {
						callback(null, JSON.parse(plain));
					} else {
						callback(Errors.generalError(2, "no cookie?", "S00027"), {});
					}
				});
			} else {
				callback(null, JSON.parse(crypted));
			}
		} catch (error) {
			callback(Errors.generalError(7, "unknown error.", "S00028"), {});
		}
	}

	/**
	 *
	 * @param callback
	 */
	private init_definition(callback: (error: IErrorObject) => void): void {
		fs.open(path.join(_config, "account_definition.json"), "r", 384, (error: IErrorObject, fd: number) => {
			if (!error) {
				const addition: any = JSON.parse(fs.readFileSync(path.join(_config, "account_definition.json"), "utf-8"));
				fs.close(fd, () => {
					_.merge(this.content, addition);
					callback(null);
				});
			} else {
				callback(error);
			}
		});
	}

	/**
	 *
	 * @param id_seed
	 * @param username
	 * @param adding_content
	 * @param auth
	 * @returns none
	 */
	private create_param(id_seed: string, username: string, adding_content: any, auth: number, category: string, type: string): any {
		// 	const shasum: any = crypto.createHash("sha1"); //
		// 	shasum.update(id_seed);   // create userid from username.
		// 	const user_id: string = shasum.digest("hex"); //
		const user_id = new mongoose.Types.ObjectId();

		const keypair: { private: string, public: string } = Cipher.KeyPair(512);

		const content = _.cloneDeep(this.content);

		if (adding_content) {

			if (adding_content.username) {
				delete adding_content.username;
			}

			if (adding_content.password) {
				delete adding_content.password;
			}

			if (adding_content.confirm_password) {
				delete adding_content.confirm_password;
			}

			_.merge(content, adding_content);
		}

		content.mails.push(username);

		return {
			user_id,
			username: username,
			privatekey: keypair.private,
			publickey: keypair.public,
			auth,
			category,
			type,
			content,
		};
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @param param
	 * @param password
	 * @param callback
	 * @returns none
	 */
	private register(request: IContentRequest, response: object, param: { username: string }, password: string, callback: StatusCallback<any>): void {
		LocalAccount.register(new LocalAccount(param), password).then(() => {
			const user: any = request.body;
			user.username = param.username;
			user.password = password;
			this.passport.authenticate("local", (error: IErrorObject, user: any): void => {
				if (!error) {
					if (user) {
						// this.event.emitter.emit("auth:register", {user, user_id: param.user_id, username: user.username});
						callback(null, user);
					} else {
						callback({status: 500, message: "authenticate."}, null);
					}
				} else {
					callback({status: 500, message: "get_register_token " + error.message + " 913"}, null);
				}
			})(request, response);
		}).catch((error: IErrorObject): void => {
			callback({status: 500, message: "get_register_token " + error.message + " 9774"}, null);
		});
	}


	/**
	 * 初期ユーザ作成
	 * @param initusers
	 * @param callback
	 * @returns none
	 */
	public init(initusers: any[], callback: Callback<any>): void {
		this.init_definition((error: IErrorObject): void => {
			if (!error) {
				if (initusers) {
					const promises: any = [];
					initusers.forEach((user: any): void => {
						promises.push(new Promise((resolve: any, reject: any): void => {
							if (user) {
								const auth: number = user.auth;
								const type: number = user.type;
								const user_id = new mongoose.Types.ObjectId();
								const username: string = user.username;
								const rootpassword: string = user.password;

								const content: any = _.cloneDeep(this.content);

								if (user.content) {
									_.merge(content, user.content);
								}

								LocalAccount.default_find_by_name({}, username).then((account: any): void => {
									if (!account) {
										const keypair: { private: string, public: string } = Cipher.KeyPair(512);
										const promise = new Promise((resolve: any, reject: any): void => {
											LocalAccount.register(new LocalAccount({
												user_id: user_id,
												username: username,
												auth: auth,
												type: type,
												privatekey: keypair.private,
												publickey: keypair.public,
												content: content,
											}), rootpassword).then(() => {
												resolve({});
											}).catch((error: any) => {
												reject(error);
											});
										});
										promise.then((results: any): void => {
											// 	this.event.emitter.emit("auth:register", {user, user_id, username: user.username});
											resolve({});
										}).catch((error: any): void => {
											reject(error);
										});
									} else {
										resolve({});
									}

								}).catch((error: any) => {
									reject(error);
								})
							} else {
								reject(Errors.generalError(1, "no user.", "S00029"));
							}
						}));
					});

					Promise.all(promises).then((objects): void => {
						callback(null, objects);
					}).catch((error): void => {
						callback(error, null);
					});
				} else {
					callback(error, null);
				}
			} else {
				callback(Errors.generalError(1, "init error.", "S00030"), null);
			}
		});
	}

	/**
	 * operator is own or manager?
	 *
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public is_own_by_name(request: { params: IUsernameParam, user: object }, response: IJSONResponse, next: () => void): void {
		if (request.user) {
			const target: IUsernameParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			if (operator) {
				if (operator.auth < AuthLevel.user) {
					next();
				} else {
					if (operator.username === target.username) {
						next();
					} else {
						this.SendError(response, Errors.userError(2, "no prev.", "S00031"));
					}
				}
			} else {
				this.SendError(response, Errors.userError(2, "no prev.", "S00032"));
			}
		} else {
			this.SendError(response, Errors.userError(1, "not logged in.", "S00033"));
		}
	}

	/**
	 * operator is own or manager?
	 *
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public is_own_by_id(request: { params: IUserIDParam, user: object }, response: IJSONResponse, next: () => void): void {
		if (request.user) {
			const target: IUserIDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			if (operator) {
				if (operator.auth < AuthLevel.user) {
					next();
				} else {
					if (operator.user_id === target.user_id) {
						next();
					} else {
						this.SendError(response, Errors.userError(2, "no prev.", "S00034"));
					}
				}
			} else {
				this.SendError(response, Errors.userError(2, "no prev.", "S00035"));
			}
		} else {
			this.SendError(response, Errors.userError(1, "not logged in.", "S00036"));
		}
	}

	/**
	 * operator is system?
	 *
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public is_system(request: IUserRequest, response: IJSONResponse, next: () => void): void {
		if (request.user) {
			const operator: IAccountModel = this.Transform(request.user);
			if (operator) {
				if (operator.auth <= AuthLevel.system) {
					next();
				} else {
					this.SendError(response, Errors.userError(2, "no prev.", "S00037"));
				}
			} else {
				this.SendError(response, Errors.userError(2, "no prev.", "S00038"));
			}
		} else {
			this.SendError(response, Errors.userError(1, "not logged in.", "S00039"));
		}
	}

	/**
	 * operator is manager?
	 *
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public is_manager(request: IUserRequest, response: IJSONResponse, next: () => void): void {
		if (request.user) {
			const operator: IAccountModel = this.Transform(request.user);
			if (operator) {
				if (operator.auth < AuthLevel.user) {
					next();
				} else {
					this.SendError(response, Errors.userError(2, "no prev.", "S00040"));
				}
			} else {
				this.SendError(response, Errors.userError(2, "no prev.", "S00041"));
			}
		} else {
			this.SendError(response, Errors.userError(1, "not logged in.", "S00042"));
		}
	}

	/**
	 * operator is user?
	 *
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public is_user(request: IUserRequest, response: IJSONResponse, next: () => void): void {
		if (request.user) {
			const operator: IAccountModel = this.Transform(request.user);
			if (operator) {
				if (operator.auth <= AuthLevel.user) {
					next();
				} else {
					this.SendError(response, Errors.userError(2, "no prev.", "S00043"));
				}
			} else {
				this.SendError(response, Errors.userError(2, "no prev.", "S00044"));
			}
		} else {
			this.SendError(response, Errors.userError(1, "not logged in.", "S00045"));
		}
	}

	/**
	 * operator is logged in?
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public is_logged_in(request: IUserRequest, response: IJSONResponse): void {
		try {
			if (request.user) {
				this.SendRaw(response, {code: 1, message: "logged in.", tag: "S00046"});
			} else {
				this.SendRaw(response, {code: 0, message: "not logged in.", tag: "S00047"});
			}
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00048"));
		}
	}

	/**
	 * login
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_login(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (!request.user) {
				this.ifExist(response, Errors.generalError(1, "no content.", "S00049"), request.body.content, () => {
					Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string }): void => {
						this.ifSuccess(response, error, (): void => {
							request.body.username = value.username; // for multi tenant.;
							request.body.password = value.password;
							LocalAccount.default_find_by_name({}, value.username).then((account: any): void => {
								this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00050"), account, () => {
									this.ifExist(response, Errors.userError(4, "account disabled.", "S00051"), account.enabled, () => {
										this.passport.authenticate("local", (error: IErrorObject, account: any): void => {  // request.body must has username/password
											this.ifSuccess(response, error, (): void => {
												this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00052"), account, () => {
													const is_2fa = (account.secret !== "");
													if (is_2fa) {
														this.SendSuccess(response, {is_2fa});
													} else {
														request.login(account, (error: IErrorObject): void => {
															this.ifSuccess(response, error, (): void => {
																// for ws
																// this.event.emitter.emit("client:send", {username: value.username});
																this.SendSuccess(response, {is_2fa});
															});
														});
													}
												});
											});
										})(request, response);
									});
								});
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S00053"));
							});
						});
					});
				})
			} else {
				this.SendError(response, Errors.userError(5, "already logged in.", "S00054"));
			}
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00055"));
		}
	}

	/**
	 * login by totp
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_login_totp(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (!request.user) {
				this.ifExist(response, Errors.generalError(1, "no content.", "S00056"), request.body.content, () => {
					Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string, code: string }): void => {
						this.ifSuccess(response, error, (): void => {
							request.body.username = value.username;
							request.body.password = value.password;
							LocalAccount.default_find_by_name({}, value.username).then((account: IAccountModel): void => {
								this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00057"), account, () => {
									if (account.enabled) {
										if (account.secret) {
											const verified: boolean = SpeakEasy.totp.verify({secret: account.secret, encoding: "base32", token: value.code});
											if (verified) {
												request.login(account, (error: IErrorObject): void => {
													this.ifSuccess(response, error, (): void => {
														this.SendSuccess(response, {});
													});
												});
											} else {
												this.SendError(response, Errors.generalError(1, "Single-factor authentication.", "S00058"));
											}
										} else {
											this.SendError(response, Errors.userError(6, "code missmatch.", "S00059"));
										}
									} else {
										this.SendError(response, Errors.userError(4, "account disabled.", "S00060"));
									}
								});
							}).catch((error: IErrorObject) => {
								this.SendError(response, error);
							})
						});
					});
				});
			} else {
				this.SendError(response, Errors.userError(5, "already logged in.", "S00061"));
			}
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00062"));
		}
	}


	/**
	 * verify totp
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_verify_totp(request: ILoginRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.generalError(1, "no content.", "S00063"), request.body.content, () => {
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string, code: string }): void => {
					this.ifSuccess(response, error, (): void => {
						LocalAccount.default_find_by_name({}, value.username).then((account: IAccountModel): void => {
							this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00064"), account, () => {
								if (account.enabled) {
									if (account.secret) {
										const verified: boolean = SpeakEasy.totp.verify({secret: account.secret, encoding: "base32", token: value.code});
										this.SendSuccess(response, verified);
									} else {
										this.SendError(response, Errors.generalError(1, "Single-factor authentication.", "S00065"));
									}
								} else {
									this.SendError(response, Errors.userError(4, "account disabled.", "S00066"));
								}
							});
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00067"));
						})
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00068"));
		}
	}

	/**
	 * generate login token.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 *
	 * h4Yq7UxXTAYlR3sMGlDEzpMk77D4gEWj8Y%2BA0xXFao7Lz3RYJfM40TIHS1CilQ3pj8M6VxciomXrofl8e6heWXxcFeAnRZP9egev%2BVwv0N9OU8YbsNcXTv9WDhGcJlsS%2B8ojui5svs0S%2BS0GLv%2FCFlNEZP%2FcCjg1UQbeFV8qcqtC%2FfWn8CoonUxA3IdBEOXbHgJonmKwGlvrITk5YSGO%2BoEvx0CHltb7f4gImXJrem9FXuMk%2B4R7Irc3ftutjtAy
	 */
	public get_login_token(request: ILoginRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00069"), request.user, () => {
				const token = request.params.token;
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, token, (error: IErrorObject, value: { username: string, password: string }): void => {
					this.ifSuccess(response, error, (): void => {
						LocalAccount.default_find_by_name({}, value.username).then((account: any): void => {
							this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00070"), account, () => {
								if (account.enabled) {
									QRCode.toDataURL(token, (error: IErrorObject, qrcode: any): void => {
										this.ifSuccess(response, error, (): void => {
											this.SendRaw(response, qrcode);
										});
									});
								} else {
									this.SendError(response, Errors.userError(4, "account disabled.", "S00071"));
								}
							});
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00072"));
						})
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00073"));
		}
	}

	/**
	 * token login.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_token_login(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (!request.user) {
				this.ifExist(response, Errors.generalError(1, "no content.", "S00074"), request.body.content, () => {
					Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string }): void => {
						this.ifSuccess(response, error, (): void => {
							request.body.username = value.username; // for multi tenant.;
							request.body.password = value.password;
							LocalAccount.default_find_by_name({}, value.username).then((account: any): void => {
								this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00075"), account, () => {
									if (account.enabled) {
										this.passport.authenticate("local", (error: IErrorObject, account: any): void => {  // request.body must has username/password
											this.ifSuccess(response, error, (): void => {
												this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00076"), account, () => {
													const is_2fa = (account.secret !== "");
													if (is_2fa) {
														this.SendSuccess(response, {is_2fa});
													} else {
														request.login(account, (error: IErrorObject): void => {
															this.ifSuccess(response, error, (): void => {
																// for ws
																// this.event.emitter.emit("client:send", {username: value.username});
																this.SendSuccess(response, {is_2fa});
															});
														});
													}
												});
											});
										})(request, response);
									} else {
										this.SendError(response, Errors.userError(4, "account disabled.", "S00077"));
									}
								});
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S00078"));
							});
						});
					});
				});
			} else {
				this.SendError(response, Errors.userError(5, "already logged in.", "S00079"));
			}
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00080"));
		}
	}

	/**
	 *
	 * send user regist mail.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_register(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.generalError(1, "no content.", "000081"), request.body.content, () => {
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
					this.ifSuccess(response, error, (): void => {
						const username: string = value.username;
						LocalAccount.default_find_by_name({}, username).then((account: any): void => {
							if (!account) {

								const tokenValue: IUserToken = {
									auth: AuthLevel.user,
									username: value.username,
									password: value.password,
									category: value.category,
									type: value.type,
									content: value.metadata,
									target: "/",
									timestamp: Date.now(),
								};

								// const mail_object = this.message.registmail;
								const mail_object = JSON.parse(JSON.stringify(this.systemsConfig.message.registmail));

								mail_object.html.content.nickname = value.metadata.nickname;

								const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
								const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/register/" + token;
								this.sendMail({
									address: value.username,
									bcc: this.bcc,
									title: this.systemsConfig.message.registconfirmtext,
									template_url: "views/platform/auth/mail/mail_template.pug",
									source_object: mail_object,
									link,
									result_object: {code: 0, message: ["Prease Wait.", ""]},
								}, (error: IErrorObject, result: any) => {
									this.ifSuccess(response, error, (): void => {
										this.SendSuccess(response, result);
									});
								});
							} else {
								this.SendError(response, Errors.userError(7, "user already found.", "S00082"));
							}
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00083"));
						});
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00084"));
		}
	}

	/**
	 *
	 * register from token.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_register_token(request: IContentRequest, response: IRedirectResponse): void {
		try {
			this.Parse(Cipher.FixedDecrypt(request.params.token, this.systemsConfig.tokensecret), (error: IErrorObject, token: any) => {
				if (!error) {
					const tokenDateTime: any = token.timestamp;
					const username: string = token.username;
					const password: string = token.password;
					const target: any = token.target;
					const auth: number = token.auth;
					const category: string = token.category;
					const type: string = token.type;
					const adding_content: any = token.content;

					const nowDate: any = Date.now();
					if ((tokenDateTime - nowDate) < (this.systemsConfig.regist.expire * 60 * 1000)) {
						LocalAccount.default_find_by_name({}, username).then((account: any): void => {
							if (!account) {
								const param = this.create_param(username, username, adding_content, auth, category, type);
								this.register(request, response, param, password, (error: { status: number, message: string }, user: any): void => {
									if (!error) {
										request.login(user, (error: IErrorObject): void => {
											if (!error) {
												response.redirect(target);
											} else {
												response.status(error.code).render("error", {message: error.message, status: error.code});
											}
										});
									} else {
										response.status(error.status).render("error", {message: error.message, status: error.status});
									}
								});
							} else {
								response.redirect(target);
							}
						}).catch((error: IErrorObject) => {
							response.status(500).render("error", {message: error.message, status: error.code});
						});
					} else {
						response.status(200).render("error", {status: 200, message: "timeout"});
					}
				} else {
					response.status(500).render("error", {message: error.message, status: error.code});
				}
			});
		} catch (error) {
			response.status(500).render("error", {message: error.message, status: error.code});
		}
	}

	/**
	 *
	 * immediate register.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_immediate_register(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00085"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "not logged in.", "S00086"), operator.login, () => {
					if (operator.auth < AuthLevel.user) {
						this.ifExist(response, Errors.generalError(1, "no content.", "S00087"), request.body.content, () => {
							Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string,category:string, type: string, metadata: object }): void => {
								this.ifSuccess(response, error, (): void => {
									const username: string = value.username;
									LocalAccount.default_find_by_name({}, username).then((account: IAccountModel): void => {
										if (!account) {
											const username: string = value.username;
											const password: string = value.password;
											const auth: number = AuthLevel.public;
											const category: string = value.category;
											const type: string = value.type;
											const adding_content: object = value.metadata;

											const param: { username: string } = this.create_param(username, username, adding_content, auth, category, type);
											this.register(request, response, param, password, (error: { status: number, message: string }, user: any): void => {
												this.ifSuccess(response, error, (): void => {
													this.SendSuccess(response, {});
												});
											});
										} else {
											this.SendError(response, Errors.userError(7, "user already found.", "S00088"));
										}
									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S00089"));
									});
								});
							});
						});
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00090"));
					}
				});
			})
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00091"));
		}
	}

	/**
	 *
	 * send password change mail.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_password(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.generalError(1, "no content.", "S00092"), request.body.content, () => {
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
					this.ifSuccess(response, error, (): void => {
						const username: string = value.username;
						LocalAccount.default_find_by_name({}, username).then((account: IAccountModel): void => {
							this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00093"), account, () => {
								this.ifExist(response, Errors.userError(4, "account disabled.", "S00094"), account.enabled, () => {
									this.ifExist(response, Errors.userError(8, "only local account.", "S00095"), (account.provider === "local"), () => {
										const tokenValue: IPasswordToken = {
											username: value.username,
											password: value.password,
											target: "/",
											timestamp: Date.now(),
										};

										// const mail_object: any = this.message.passwordmail;
										const mail_object = JSON.parse(JSON.stringify(this.systemsConfig.message.passwordmail));

										if (mail_object.html) {
											if (mail_object.html.content) {
												mail_object.html.content.nickname = account.content.nickname;
											}
										}

										const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
										const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/password/" + token;
										this.sendMail({
											address: value.username,
											bcc: this.bcc,
											title: this.systemsConfig.message.passwordconfirmtext,
											template_url: "views/platform/auth/mail/mail_template.pug",
											source_object: mail_object,
											link,
											result_object: {code: 0, message: "", tag: ""},
										}, (error: IErrorObject, result: any) => {
											this.ifSuccess(response, error, (): void => {
												this.SendSuccess(response, result);
											});
										});
									});
								});
							});
						}).catch((error: IErrorObject) => {
							this.SendError(response, Errors.Exception(error, "S00096"));
						});
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00097"));
		}
	}

	/**
	 *
	 * password change by token.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_password_token(request: IContentRequest, response: IRedirectResponse): void {
		try {
			this.Parse(Cipher.FixedDecrypt(request.params.token, this.systemsConfig.tokensecret), (error: IErrorObject, token: any) => {
				if (!error) {
					const tokenDateTime: any = token.timestamp;
					const username: string = token.username;
					const password: string = token.password;
					const target: any = token.target;
					const nowDate: any = Date.now();
					if ((tokenDateTime - nowDate) < (this.systemsConfig.regist.expire * 60 * 1000)) {
						LocalAccount.default_find_by_name({}, username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									if (account.provider === "local") {// OAuthは除外
										account.setPassword(password, (error: IErrorObject): void => {
											if (!error) {
												account.save((error: IErrorObject, obj: any): void => {
													if (!error) {
														response.redirect(target);
													} else {
														response.status(500).render("error", {message: "db error. 4572", status: 500}); // timeout
													}
												});
											} else {
												response.status(500).render("error", {message: "get_password_token " + error.message, status: 500}); // already
											}
										});
									} else {
										response.status(200).render("error", {message: "ローカルアカウントのみ可能です", status: 200}); // already
									}
								} else {
									response.status(200).render("error", {message: "アカウントが無効です", status: 200}); // already
								}
							} else {
								response.status(200).render("error", {message: "Already. 1110", status: 200}); // already
							}
						}).catch((error: IErrorObject) => {
							response.status(500).render("error", {message: error.message, status: error.code});
						});
					} else {
						response.status(200).render("error", {message: "Timeout", status: 200}); // timeout
					}
				} else {
					response.status(500).render("error", {message: error.message, status: error.code});
				}
			});
		} catch (error) {
			response.status(500).render("error", {message: error.message, status: error.code});
		}
	}

	/**
	 * direct password change.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_immediate_password(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00098"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "not logged in.", "S00099"), operator.login, () => {
					if (operator.auth < AuthLevel.user) {
						this.ifExist(response, Errors.generalError(1, "no content.", "S00100"), request.body.content, () => {
							Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
								this.ifSuccess(response, error, (): void => {
									const username: string = value.username;
									LocalAccount.default_find_by_name({}, username).then((account: any): void => {
										this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00101"), account, () => {
											this.ifExist(response, Errors.userError(4, "account disabled.", "S00102"), account.enabled, () => {
												this.ifExist(response, Errors.userError(8, "only local account.", "S00103"), (account.provider === "local"), () => {
													if (Auth.permit_for_change_account(request.user, account)) {
														const password: string = value.password;
														account.setPassword(password, (error: IErrorObject): void => {
															this.ifSuccess(response, error, (): void => {
																account.save((error: IErrorObject, obj: any): void => {
																	this.ifSuccess(response, error, (): void => {
																		this.SendSuccess(response, {});
																	});
																});
															});
														});
													} else {
														this.SendError(response, Errors.userError(2, "no prev.", "S00104"));
													}
												});
											});
										});
									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S00105"));
									});
								});
							});
						});
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00106"));
					}
				})
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00107"));
		}
	}

	/**
	 *
	 * send username change mail.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_username(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00108"), request.user, () => {
				this.ifExist(response, Errors.generalError(1, "no content.", "S00109"), request.body.content, () => {
					const operator: IAccountModel = this.Transform(request.user);
					Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
						this.ifSuccess(response, error, (): void => {
							const original_username: string = operator.username;
							const update_username: string = value.update_username;
							LocalAccount.default_find_by_name({}, original_username).then((account: IAccountModel): void => {
								this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00110"), account, () => {
									this.ifExist(response, Errors.userError(4, "account disabled.", "S00111"), account.enabled, () => {
										this.ifExist(response, Errors.userError(8, "only local account.", "S00112"), (account.provider === "local"), () => {
											LocalAccount.default_find_by_name({}, update_username).then((samename: IAccountModel): void => {
												this.ifExist(response, Errors.userError(7, "user already found.", "S00113"), !samename, () => {   // no samename then
													const tokenValue: IUserNameToken = {
														original_username: original_username,
														update_username: update_username,
														target: "/",
														timestamp: Date.now(),
													};
													// const mail_object: any = this.message.usernamemail;
													const mail_object = JSON.parse(JSON.stringify(this.systemsConfig.message.usernamemail));
													mail_object.html.content.nickname = account.content.nickname;
													const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
													const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/username/" + token;
													this.sendMail({
														address: update_username,
														bcc: this.bcc,
														title: this.systemsConfig.message.usernameconfirmtext,
														template_url: "views/platform/auth/mail/mail_template.pug",
														source_object: mail_object,
														link,
														result_object: {code: 0, message: "", tag: ""},
													}, (error: IErrorObject, result: any) => {
														this.ifSuccess(response, error, (): void => {
															request.logout();
															this.SendSuccess(response, result);
														});
													});
												});
											}).catch((error: IErrorObject) => {
												this.SendError(response, Errors.Exception(error, "S00114"));
											});
										});
									});
								});
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S00115"));
							});
						});
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00116"));
		}
	}

	/**
	 *
	 * change username by token.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_username_token(request: IContentRequest, response: IRedirectResponse): void {
		try {
			this.Parse(Cipher.FixedDecrypt(request.params.token, this.systemsConfig.tokensecret), (error: IErrorObject, token: any) => {
				if (!error) {
					const tokenDateTime: any = token.timestamp;
					const original_username: string = token.original_username;
					const update_username: string = token.update_username;
					const target: any = token.target;
					const nowDate: any = Date.now();
					if ((tokenDateTime - nowDate) < (this.systemsConfig.regist.expire * 60 * 1000)) {
						LocalAccount.default_find_by_name({}, original_username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									LocalAccount.default_find_by_name({}, update_username).then((samename: IAccountModel): void => {
										if (!samename) {
											if (account.provider === "local") {// OAuthは除外

												const setter: any = {
													$set: {
														username: update_username,
													},
												};

												LocalAccount.findOneAndUpdate({username: original_username}, setter, {upsert: false}).then(() => {
													response.redirect(target);
												}).catch((error: IErrorObject): void => {
													response.status(500).render("error", {message: "db error. 4572", status: 500}); // timeout
												});
											} else {
												response.status(200).render("error", {message: "ローカルアカウントのみ可能です", status: 200}); // already
											}
										} else {
											response.status(200).render("error", {message: "ユーザは既に存在します", status: 200}); // already
										}
									}).catch((error: IErrorObject) => {
										response.status(500).render("error", {message: error.message, status: error.code});
									});
								} else {
									response.status(200).render("error", {message: "Already. 1110", status: 200}); // already
								}
							} else {
								response.status(200).render("error", {message: "既にログインしています。", status: 200}); // already
							}

						}).catch((error: IErrorObject) => {
							response.status(500).render("error", {message: error.message, status: error.code});
						});
					} else {
						response.status(200).render("error", {message: "Timeout", status: 200}); // timeout
					}
				} else {
					response.status(500).render("error", {message: error.message, status: error.code});
				}
			});
		} catch (error) {
			response.status(500).render("error", {message: error.message, status: error.code});
		}
	}

	/**
	 *
	 * direct username change.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_immediate_username(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00117"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				this.ifExist(response, Errors.userError(1, "not logged in.", "S00118"), operator.login, () => {
					if (operator.auth < AuthLevel.user) {
						this.ifExist(response, Errors.generalError(1, "no content.", "S00119"), request.body.content, () => {
							const operator: IAccountModel = this.Transform(request.user);
							Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
								this.ifSuccess(response, error, (): void => {
									const original_username: string = value.original_username;
									const update_username: string = value.update_username;
									LocalAccount.default_find_by_name({}, original_username).then((account: IAccountModel): void => {
										this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00120"), account, () => {
											this.ifExist(response, Errors.userError(4, "account disabled.", "S00121"), account.enabled, () => {
												this.ifExist(response, Errors.userError(8, "only local account.", "S00122"), (account.provider === "local"), () => {
													LocalAccount.default_find_by_name({}, update_username).then((samename: IAccountModel): void => {
														this.ifExist(response, Errors.userError(7, "user already found.", "S00123"), !samename, () => {   // no samename then
															this.ifExist(response, Errors.userError(8, "only local account.", "S00124"), (account.provider === "local"), () => {

																const setter: any = {
																	$set: {
																		username: update_username,
																	},
																};

																LocalAccount.findOneAndUpdate({username: original_username}, setter, {upsert: false}).then(() => {
																	this.SendSuccess(response, {});
																}).catch((error: IErrorObject): void => {
																	this.SendError(response, Errors.generalError(1, "db error.", "S00125"));
																});
															});
														});
													}).catch((error: IErrorObject) => {
														this.SendError(response, Errors.Exception(error, "S00126"));
													});
												});
											});
										});
									}).catch((error: IErrorObject) => {
										this.SendError(response, Errors.Exception(error, "S00127"));
									});
								});
							});
						});
					} else {
						this.SendError(response, Errors.generalError(2, "unreadable.", "S00128"));
					}
				})
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00129"));
		}
	}

	/**
	 *
	 * send user remove mail.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_remove(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00130"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				const username: string = operator.username;
				LocalAccount.default_find_by_name({}, username).then((account: IAccountModel): void => {
					this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00131"), account, () => {
						this.ifExist(response, Errors.userError(4, "account disabled.", "S00132"), account.enabled, () => {
							this.ifExist(response, Errors.userError(8, "only local account.", "S00133"), (account.provider === "local"), () => {
								const tokenValue: any = {
									username: username,
									target: "/",
									timestamp: Date.now(),
								};
								// const mail_object = this.message.removemail;
								const mail_object = JSON.parse(JSON.stringify(this.systemsConfig.message.removemail));
								mail_object.html.content.nickname = account.content.nickname;
								const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
								const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/remove/" + token;
								this.sendMail({
									address: username,
									bcc: this.bcc,
									title: this.systemsConfig.message.removeconfirmtext,
									template_url: "views/platform/auth/mail/mail_template.pug",
									source_object: mail_object,
									link,
									result_object: {code: 0, message: "", tag: ""},
								}, (error: IErrorObject, result: any) => {
									this.ifSuccess(response, error, (): void => {
										request.logout();
										this.SendSuccess(response, result);
									});
								});
							});
						});
					});
				}).catch((error: IErrorObject) => {
					this.SendError(response, Errors.Exception(error, "S00134"));
				});
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00135"));
		}
	}

	/**
	 *
	 * user remove by token.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_remove_token(request: IContentRequest, response: IRedirectResponse): void {
		try {
			this.Parse(Cipher.FixedDecrypt(request.params.token, this.systemsConfig.tokensecret), (error: IErrorObject, token: any) => {
				if (!error) {
					const tokenDateTime: any = token.timestamp;
					const username: string = token.username;
					const target: any = token.target;
					const nowDate: any = Date.now();
					if ((tokenDateTime - nowDate) < (this.systemsConfig.regist.expire * 60 * 1000)) {
						LocalAccount.default_find_by_name({}, username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									LocalAccount.remove_by_id(null, account.user_id).then(() => {
										request.logout();
										response.redirect(target);
									}).catch((error: IErrorObject): void => {
										response.status(500).render("error", {message: error.message, status: error.code});
									});
								} else {
									response.status(200).render("error", {message: "Already. 1110", status: 200}); // already
								}
							} else {
								response.status(200).render("error", {message: "既にログインしています。", status: 200}); // already
							}
						}).catch((error: IErrorObject) => {
							response.status(500).render("error", {message: error.message, status: error.code});
						});
					} else {
						response.status(200).render("error", {message: "Timeout", status: 200}); // timeout
					}
				} else {
					response.status(500).render("error", {message: error.message, status: error.code});
				}
			});
		} catch (error) {
			response.status(500).render("error", {message: error.message, status: error.code});
		}
	}

	/**
	 *
	 * direct user remove
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_immediate_remove(request: IContentRequest, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00136"), request.user, () => {
				const operator: any = request.user;
				LocalAccount.default_find_by_id({}, operator.user_id).then((account: any): void => {
					this.ifExist(response, Errors.userError(3, "username or password missmatch.", "S00137"), account, () => {
						this.ifExist(response, Errors.userError(4, "account disabled", "S00138"), !account.enabled, () => {  // not enabled then
							LocalAccount.remove_by_id(null, operator.user_id).then(() => {
								request.logout();
								this.SendSuccess(response, null);
							}).catch((error: IErrorObject): void => {
								this.SendError(response, Errors.Exception(error, "S00139"));
							});
						});
					});
				}).catch((error: IErrorObject) => {
					this.SendError(response, Errors.Exception(error, "S00140"));
				})
			})
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00141"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public auth_facebook_callback(request: IUserRequest, response: any): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00142"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				LocalAccount.default_find_by_name({}, operator.username).then((account: any): void => {
					if (!account) {
						const keypair: { private: string, public: string } = Cipher.KeyPair(512);

						const newAccount: any = new LocalAccount();
						newAccount.provider = operator.provider;
						newAccount.auth = AuthLevel.public;
						// 	newAccount.user_id = operator.user_id;
						newAccount.user_id = new mongoose.Types.ObjectId();
						newAccount.username = operator.username;
						newAccount.privatekey = keypair.private;
						newAccount.publickey = keypair.public;
						newAccount.content = operator.content;
						newAccount.content.facebook_id = operator.user_id;

						newAccount.save((error: IErrorObject, obj: any): void => {
							if (!error) {
								response.redirect("/");
							} else {
								response.render("error", {
									message: error.message,
									status: 1000,
								});
							}
						});
					} else {
						response.redirect("/");
					}
				}).catch((error: IErrorObject) => {
					this.SendError(response, error);
				})
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00379"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public auth_apple_callback(request: IUserRequest, response: IRedirectResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00143"), request.user, () => {
				const operator: IAccountModel = this.Transform(request.user);
				LocalAccount.default_find_by_name({}, operator.username).then((account: any): void => {
					if (!account) {
						const keypair: { private: string, public: string } = Cipher.KeyPair(512);

						const newAccount: any = new LocalAccount();
						newAccount.provider = operator.provider;
						newAccount.auth = AuthLevel.public;
						newAccount.user_id = operator.user_id;
						newAccount.username = operator.username;
						newAccount.privatekey = keypair.private;
						newAccount.publickey = keypair.public;
						newAccount.content = operator.content;
						newAccount.save((error: IErrorObject, obj: object): void => {
							if (!error) {
								response.redirect("/");
							}
						});
					} else {
						response.redirect("/");
					}
				}).catch((error: IErrorObject) => {
					this.SendError(response, error);
				})
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00380"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public auth_twitter_callback(request: IUserRequest, response: IRedirectResponse): void {
		try {
			LocalAccount.default_find_by_name({}, request.user.username).then((account: any): void => {
				if (!account) {
					const keypair: { private: string, public: string } = Cipher.KeyPair(512);
					const user_id: string = request.user.id;  // twitter
					// const content: any = JSON.parse(JSON.stringify(definition)); // deep copy...

					const newAccount: any = new LocalAccount();
					newAccount.provider = "twitter";
					newAccount.user_id = user_id;
					newAccount.username = request.user.username;
					newAccount.privatekey = keypair.private;
					newAccount.publickey = keypair.public;
					newAccount.content = this.content;
					newAccount.save((error: IErrorObject, obj: object): void => {
						if (!error) {
							response.redirect("/");
						}
					});
				} else {
					// Auth.auth_event("login:twitter", request.user.username);
					response.redirect("/");
				}
			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00381"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public auth_instagram_callback(request: IUserRequest, response: IRedirectResponse): void {
		try {
			LocalAccount.default_find_by_name({}, request.user.username).then((account: any): void => {
				if (!account) {
					const keypair: { private: string, public: string } = Cipher.KeyPair(512);
					const user_id: string = request.user.id;
					// const content: any = JSON.parse(JSON.stringify(definition)); // deep copy...

					const newAccount: any = new LocalAccount();
					newAccount.provider = "instagram";
					newAccount.user_id = user_id;
					newAccount.username = request.user.username;
					newAccount.privatekey = keypair.private;
					newAccount.publickey = keypair.public;
					newAccount.content = this.content;
					newAccount.save((error: IErrorObject, obj: object): void => {
						if (!error) {
							// Auth.auth_event("auth:instagram", newAccount);
							response.redirect("/");
						}
					});
				} else {
					// Auth.auth_event("login:instagram", request.user.username);
					response.redirect("/");
				}

			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00382"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public auth_line_callback(request: IUserRequest, response: IRedirectResponse): void {
		try {
			const username: string = request.user.username;
			LocalAccount.default_find_by_name({}, username).then((account: any): void => {
				if (!account) {
					const keypair: { private: string, public: string } = Cipher.KeyPair(512);
					const user_id: string = request.user.id;

					const newAccount: any = new LocalAccount();
					newAccount.provider = "line";
					newAccount.user_id = user_id;
					newAccount.username = username;
					newAccount.privatekey = keypair.private;
					newAccount.publickey = keypair.public;
					newAccount.content = {mails: [], nickname: request.user.displayName, id: "", description: ""};
					// newAccount.registerDate = Date.now();              // Legacy of v1
					newAccount.save((error: IErrorObject, obj: object): void => {
						if (!error) {
							// Auth.auth_event("auth:line", newAccount);
							response.redirect("/");
						}
					});
				} else {
					// Auth.auth_event("login:line", request.user.username);
					response.redirect("/");
				}
			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00383"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public logout(request: { logout: () => void }, response: IJSONResponse): void {
		try {
			request.logout();
			this.SendSuccess(response, {code: 0, message: "", tag: ""});
		} catch (error) {
			this.SendFatal(response, Errors.Exception(error, "S00384"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @param next
	 * @returns none
	 */
	public get_server_date(request: object, response: IJSONResponse, next: () => void): void {
		this.SendSuccess(response, new Date());
	}

}

module.exports = Auth;
