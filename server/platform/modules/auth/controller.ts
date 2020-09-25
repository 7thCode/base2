/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject, IPasswordToken, IUserNameToken, IUserToken, StatusCallback} from "../../../../types/platform/universe";

import {IAccountModel, IContentRequest, IJSONResponse, ILoginRequest, IRedirectResponse, IUserIDParam, IUsernameParam, IUserRequest} from "../../../../types/platform/server";

const _: any = require("lodash");
const fs: any = require("graceful-fs");
const crypto: any = require("crypto");
const SpeakEasy: any = require("speakeasy");
const QRCode: any = require("qrcode");

const path: any = require("path");
const project_root = path.join(__dirname, "../../../..");

const _config: string = path.join(project_root, "config");

const Cipher: any = require("../../../../server/platform/base/library/cipher");
const Mail: any = require("../../../../server/platform/base/controllers/mail_controller");
const LocalAccount: any = require("../../../../models/platform/accounts/account");

export class Auth extends Mail {

	private readonly content: any = {mails: [], nickname: "", tokens: {}};
	private readonly passport: any;
	private readonly message: any;
	private readonly errors: any[];

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @param passport
	 */
	constructor(event: object, config: object, logger: object, passport: object) {
		super(event, config, logger);
		this.passport = passport;
		this.message = this.systemsConfig.message;
		this.errors = [
			{code: 1, message: this.message.not_logged_in},
			{code: 2, message: this.message.already_logged_in},
			{code: 3, message: this.message.account_disabled},
			{code: 4, message: this.message.only_local_account},
			{code: 5, message: this.message.no_permission},
			{code: 6, message: this.message.code_mismatch},
			{code: 7, message: this.message.unknown_error},
			{code: 8, message: this.message.username_already_regist},
			{code: 9, message: this.message.username_notfound}
		];
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
						callback({code: 2, message: "no cookie? 5977"}, {});
					}
				});
			} else {
				callback(null, JSON.parse(crypted));
			}
		} catch (error) {
			callback(this.error[6], {});
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
	private create_param(id_seed: string, username: string, adding_content: any, auth: number): any {
		const shasum: any = crypto.createHash("sha1"); //
		shasum.update(id_seed);                      // create userid from username.
		const user_id: string = shasum.digest("hex"); //

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
	private register(request: ILoginRequest, response: object, param: { username: string }, password: string, callback: StatusCallback<any>): void {
		LocalAccount.register(new LocalAccount(param), password).then(() => {
			const user: { username: string; password: string } = request.body;
			user.username = param.username;
			user.password = password;
			this.passport.authenticate("local", (error: IErrorObject, user: any): void => {
				if (!error) {
					if (user) {
						// this.event.emitter.emit("auth:register", {user, user_id: param.user_id, username: user.username});
						callback(null, user);
					} else {
						callback({status: 500, message: "authenticate. 3701"}, null);
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
	 *
	 * @param operator
	 * @param target
	 * manager以上は任意のユーザのパスワード変更可能
	 * それ以外は自身のパスワードのみ変更可能
	 */
	private permit_for_change_account(operator: any, target: any): boolean {
		let result: boolean;
		if (operator.auth < AuthLevel.user) {
			result = true;
		} else {
			result = (operator.user_id === target.user_id)
		}
		return result;
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

								const user_id: string = user.user_id;
								const username: string = user.username; // for multi tenant.
								const rootpassword: string = user.password;

								const content: any = _.cloneDeep(this.content);

								if (user.content) {
									_.merge(content, user.content);
								}

								LocalAccount.default_find_by_id_promise({}, user_id).then((account: any): void => {

									if (!account) {
										const keypair: { private: string, public: string } = Cipher.KeyPair(512);
										const promise = new Promise((resolve: any, reject: any): void => {
											LocalAccount.register(new LocalAccount({
													user_id,
													username: username,
													auth,
													privatekey: keypair.private,
													publickey: keypair.public,
													content,
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
								reject({code: -1, message: "no user. 4902"});
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
				callback({code: -1, message: "init error. 6988"}, null);
			}
		});
	}

	/**
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
						this.SendError(response, {code: 403, message: "Forbidden. 7795"});
					}
				}
			} else {
				this.SendError(response, {code: 403, message: "Forbidden. 927"});
			}
		} else {
			this.SendError(response, {code: 403, message: "Not Logged in. 1924"});
		}
	}

	/**
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
						this.SendError(response, {code: 403, message: "Forbidden. 7795"});
					}
				}
			} else {
				this.SendError(response, {code: 403, message: "Forbidden. 927"});
			}
		} else {
			this.SendError(response, {code: 403, message: "Not Logged in. 1924"});
		}
	}

	/**
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
					this.SendError(response, {code: 403, message: "Forbidden. 9578"});
				}
			} else {
				this.SendError(response, {code: 403, message: "Forbidden. 9742"});
			}
		} else {
			this.SendError(response, {code: 403, message: "Not Logged in. 7789"});
		}
	}

	/**
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
					this.SendError(response, {code: 403, message: "Forbidden. 7896"});
				}
			} else {
				this.SendError(response, {code: 403, message: "Forbidden. 2656"});
			}
		} else {
			this.SendError(response, {code: 403, message: "Not Logged in. 5227"});
		}
	}

	/**
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
					this.SendError(response, {code: 403, message: "Forbidden. 5081"});
				}
			} else {
				this.SendError(response, {code: 403, message: "Forbidden. 4026"});
			}
		} else {
			this.SendError(response, {code: 403, message: "Not Logged in. 8094"});
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public is_logged_in(request: IUserRequest, response: IJSONResponse): void {
		try {
			if (request.user) {
				this.SendRaw(response, {code: 1, message: "logged in. 3804"});
			} else {
				this.SendRaw(response, {code: 0, message: "not logged in. 1463"});
			}
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_login(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (!request.user) {
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string }): void => {
					this.ifSuccess(response, error, (): void => {
						request.body.username = value.username; // for multi tenant.;
						request.body.password = value.password;
						LocalAccount.default_find_by_name_promise({}, value.username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									this.passport.authenticate("local", (error: IErrorObject, account: any): void => {  // request.body must has username/password
										if (!error) {
											if (account) {
												const is_2fa = (account.secret !== "");
												if (is_2fa) {
													this.SendSuccess(response, {is_2fa});
												} else {
													request.login(account, (error: IErrorObject): void => {
														if (!error) {
															// for ws
															// this.event.emitter.emit("client:send", {username: value.username});
															this.SendSuccess(response, {is_2fa});
														} else {
															this.SendError(response, this.errors[6]);
														}
													});
												}
											} else {
												this.SendError(response, this.errors[8]);
											}
										} else {
											this.SendError(response, this.errors[8]);
										}
									})(request, response);
								} else {
									this.SendError(response, this.errors[2]);
								}
							} else {
								this.SendError(response, this.errors[8]);
							}
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					});
				});
			} else {
				this.SendError(response, this.errors[1]);
			}
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_login_totp(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (!request.user) {
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string, code: string }): void => {
					this.ifSuccess(response, error, (): void => {
						request.body.username = value.username; // for multi tenant.;
						request.body.password = value.password;
						LocalAccount.default_find_by_name_promise({}, value.username).then((account: IAccountModel): void => {
							if (account) {
								if (account.enabled) {
									let verified: boolean = true;
									if (account.secret) {
										verified = SpeakEasy.totp.verify({secret: account.secret, encoding: "base32", token: value.code});
									}
									if (verified) {
										request.login(account, (error: IErrorObject): void => {
											if (!error) {
												this.SendSuccess(response, {});
											} else {
												this.SendError(response, this.errors[6]);
											}
										});
									} else {
										this.SendError(response, this.errors[5]);
									}
								} else {
									this.SendError(response, this.errors[2]);
								}
							} else {
								this.SendError(response, this.errors[8]);
							}

						}).catch((error: any) => {
							this.SendError(response, error);
						})
					});
				});
			} else {
				this.SendError(response, this.errors[1]);
			}
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 *
	 * h4Yq7UxXTAYlR3sMGlDEzpMk77D4gEWj8Y%2BA0xXFao7Lz3RYJfM40TIHS1CilQ3pj8M6VxciomXrofl8e6heWXxcFeAnRZP9egev%2BVwv0N9OU8YbsNcXTv9WDhGcJlsS%2B8ojui5svs0S%2BS0GLv%2FCFlNEZP%2FcCjg1UQbeFV8qcqtC%2FfWn8CoonUxA3IdBEOXbHgJonmKwGlvrITk5YSGO%2BoEvx0CHltb7f4gImXJrem9FXuMk%2B4R7Irc3ftutjtAy
	 */
	public get_login_token(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (request.user) {
				const token = request.params.token;
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, token, (error: IErrorObject, value: { username: string, password: string }): void => {
					this.ifSuccess(response, error, (): void => {
						LocalAccount.default_find_by_name_promise({}, value.username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									QRCode.toDataURL(token, (error: IErrorObject, qrcode: any): void => {
										this.ifSuccess(response, error, (): void => {
											this.SendRaw(response, qrcode);
										});
									});
								} else {
									this.SendError(response, this.errors[2]);
								}
							} else {
								this.SendError(response, this.errors[8]);
							}
						}).catch((error: any) => {
							this.SendError(response, error);
						})
					});
				});
			} else {
				this.SendError(response, this.errors[0]);
			}
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_token_login(request: ILoginRequest, response: IJSONResponse): void {
		try {
			if (!request.user) {
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string }): void => {
					this.ifSuccess(response, error, (): void => {
						request.body.username = value.username; // for multi tenant.;
						request.body.password = value.password;
						LocalAccount.default_find_by_name_promise({}, value.username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									this.passport.authenticate("local", (error: IErrorObject, account: any): void => {  // request.body must has username/password
										if (!error) {
											if (account) {
												const is_2fa = (account.secret !== "");
												if (is_2fa) {
													this.SendSuccess(response, {is_2fa});
												} else {
													request.login(account, (error: IErrorObject): void => {
														if (!error) {
															// for ws
															// this.event.emitter.emit("client:send", {username: value.username});
															this.SendSuccess(response, {is_2fa});
														} else {
															this.SendError(response, this.errors[6]);
														}
													});
												}
											} else {
												this.SendError(response, this.errors[8]);
											}
										} else {
											this.SendError(response, this.errors[8]);
										}
									})(request, response);
								} else {
									this.SendError(response, this.errors[2]);
								}
							} else {
								this.SendError(response, this.errors[8]);
							}
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					});
				});
			} else {
				this.SendError(response, this.errors[1]);
			}
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_register(request: IContentRequest, response: IJSONResponse): void {
		try {
			Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
				this.ifSuccess(response, error, (): void => {
					const username: string = value.username;
					LocalAccount.default_find_by_name_promise({}, username).then((account: any): void => {
						if (!account) {

							const tokenValue: IUserToken = {
								auth: 10000,
								username: value.username,
								password: value.password,
								content: value.metadata,
								target: "/",
								timestamp: Date.now(),
							};

							const mail_object = this.message.registmail;
							mail_object.content.subtitle = mail_object.content.subtitle_reader + value.metadata.nickname + mail_object.content.subtitle_trailer;

							const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
							const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/register/" + token;
							this.sendMail({
								address: value.username,
								bcc: this.bcc,
								title: this.message.registconfirmtext,
								template_url: "views/platform/auth/mail/mail_template.pug",
								source_object: mail_object,
								link,
								result_object: {code: 0, message: ["Prease Wait.", ""]},
							}, (error: IErrorObject, result: any) => {
								if (!error) {
									this.SendSuccess(response, result);
								} else {
									this.SendError(response, error);
								}
							});
						} else {
							this.SendWarn(response, this.errors[7]);
						}
					}).catch((error: any) => {
						this.SendError(response, error);
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get_register_token(request: ILoginRequest, response: IRedirectResponse): void {
		try {
			this.Parse(Cipher.FixedDecrypt(request.params.token, this.systemsConfig.tokensecret), (error: IErrorObject, token: any) => {
				if (!error) {
					const tokenDateTime: any = token.timestamp;
					const username: string = token.username;
					const password: string = token.password;
					const target: any = token.target;
					const auth: number = token.auth;
					const adding_content: any = token.content;

					const nowDate: any = Date.now();
					if ((tokenDateTime - nowDate) < (this.systemsConfig.regist.expire * 60 * 1000)) {
						LocalAccount.default_find_by_name_promise({}, username).then((account: any): void => {
							if (!account) {
								const param = this.create_param(username, username, adding_content, auth);
								this.register(request, response, param, password, (error: { status: number, message: string }, user: any): void => {
									if (!error) {
										request.login(user, (error: IErrorObject): void => {
											if (!error) {
												response.redirect(target);
											} else {
												response.status(error.code).render("error", error);
											}
										});
									} else {
										response.status(error.status).render("error", error);
									}
								});
							} else {
								response.redirect(target);
							}
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					} else {
						response.status(200).render("error", {status: 200, message: "timeout"});
					}
				} else {
					response.status(500).render("error", error);
				}
			});
		} catch (error) {
			response.status(500).render("error", error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_immediate_register(request: ILoginRequest, response: IJSONResponse): void {
		try {
			Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: { username: string, password: string, metadata: object }): void => {
				this.ifSuccess(response, error, (): void => {
					const username: string = value.username;
					LocalAccount.default_find_by_name_promise({}, username).then((account: IAccountModel): void => {
						if (!account) {
							const username: string = value.username;
							const password: string = value.password;
							const auth: number = AuthLevel.public;
							const adding_content: object = value.metadata;

							const param: { username: string } = this.create_param(username, username, adding_content, auth);
							this.register(request, response, param, password, (error: { status: number, message: string }, user: any): void => {
								this.ifSuccess(response, error, (): void => {
									this.SendSuccess(response, {});
								});
							});
						} else {
							this.SendWarn(response, this.errors[7]);
						}
					}).catch((error: any) => {
						this.SendError(response, error);
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_password(request: IContentRequest, response: IJSONResponse): void {
		try {
			Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
				this.ifSuccess(response, error, (): void => {
					const username: string = value.username;
					LocalAccount.default_find_by_name_promise({}, username).then((account: IAccountModel): void => {
						if (account) {
							if (account.enabled) {
								if (account.provider === "local") {
									const tokenValue: IPasswordToken = {
										username: value.username,
										password: value.password,
										target: "/",
										timestamp: Date.now(),
									};

									const mail_object = this.message.passwordmail;
									mail_object.content.subtitle = mail_object.content.subtitle_reader + account.content.nickname + mail_object.content.subtitle_trailer;

									const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
									const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/password/" + token;
									this.sendMail({
										address: value.username,
										bcc: this.bcc,
										title: this.message.passwordconfirmtext,
										template_url: "views/platform/auth/mail/mail_template.pug",
										source_object: mail_object,
										link,
										result_object: {code: 0, message: ""},
									}, (error: IErrorObject, result: any) => {
										if (!error) {
											this.SendSuccess(response, result);
										} else {
											this.SendError(response, error);
										}
									});
								} else {
									this.SendWarn(response, this.errors[3]);
								}
							} else {
								this.SendError(response, this.errors[2]);
							}
						} else {
							this.SendWarn(response, this.errors[8]);
						}
					}).catch((error: any) => {
						this.SendError(response, error);
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
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
						LocalAccount.default_find_by_name_promise({}, username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									if (account.provider === "local") {　// OAuthは除外
										account.setPassword(password, (error: IErrorObject): void => {
											if (!error) {
												account._save((error: IErrorObject, obj: any): void => {
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
										response.status(200).render("error", this.errors[3]); // already
									}
								} else {
									response.status(200).render("error", this.errors[2]); // already
								}
							} else {
								response.status(200).render("error", {message: "Already. 1110", status: 200}); // already
							}
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					} else {
						response.status(200).render("error", {message: "Timeout", status: 200}); // timeout
					}
				} else {
					response.status(500).render("error", error);
				}
			});
		} catch (error) {
			response.status(500).render("error", error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_username(request: any, response: IJSONResponse): void {
		try {
			if (request.user) {
				const operator: IAccountModel = this.Transform(request.user);
				Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
					this.ifSuccess(response, error, (): void => {
						const original_username: string = operator.username;
						const update_username: string = value.update_username;
						LocalAccount.default_find_by_name_promise({}, original_username).then((account: IAccountModel): void => {
							if (account) {
								if (account.enabled) {
									if (account.provider === "local") {
										LocalAccount.default_find_by_name_promise({}, update_username).then((already: IAccountModel): void => {
											if (!already) {
												const tokenValue: IUserNameToken = {
													original_username: original_username,
													update_username: update_username,
													target: "/",
													timestamp: Date.now(),
												};
												const mail_object = this.message.usernamemail;
												mail_object.content.subtitle = mail_object.content.subtitle_reader + account.content.nickname + mail_object.content.subtitle_trailer;
												const token: string = Cipher.FixedCrypt(JSON.stringify(tokenValue), this.systemsConfig.tokensecret);
												const link: string = this.systemsConfig.protocol + "://" + this.systemsConfig.domain + "/auth/username/" + token;
												this.sendMail({
													address: update_username,
													bcc: this.bcc,
													title: this.message.usernameconfirmtext,
													template_url: "views/platform/auth/mail/mail_template.pug",
													source_object: mail_object,
													link,
													result_object: {code: 0, message: ""},
												}, (error: IErrorObject, result: any) => {
													if (!error) {
														request.logout();
														this.SendSuccess(response, result);
													} else {
														this.SendError(response, error);
													}
												});
											} else {
												this.SendWarn(response, this.errors[7]);
											}
										}).catch((error: any) => {
											this.SendError(response, error);
										});
									} else {
										this.SendWarn(response, this.errors[3]);
									}
								} else {
									this.SendError(response, this.errors[2]);
								}
							} else {
								this.SendWarn(response, this.errors[8]);
							}
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					});
				});
			} else {
				this.SendError(response, this.errors[1]);
			}
		} catch (error) {
			this.SendFatal(response, error);
		}
	}

	/**
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
						LocalAccount.default_find_by_name_promise({}, original_username).then((account: any): void => {
							if (account) {
								if (account.enabled) {
									LocalAccount.default_find_by_name_promise({}, update_username).then((already: IAccountModel): void => {
										if (!already) {
											if (account.provider === "local") {　// OAuthは除外

												const setter = {
													$set: {
														username: update_username,
													},
												};

												LocalAccount.findOneAndUpdate({username: original_username}, setter, {upsert: false}).exec().then(() => {
													response.redirect(target);
												}).catch((error: IErrorObject): void => {
													response.status(500).render("error", {message: "db error. 4572", status: 500}); // timeout
												});
											} else {
												response.status(200).render("error", this.errors[3]); // already
											}
										} else {
											response.status(200).render("error", {message: this.message.username_already_regist, status: 200}); // already
										}
									}).catch((error: any) => {
										response.status(500).render("error", error);
									});
								} else {
									response.status(200).render("error", {message: "Already. 1110", status: 200}); // already
								}
							} else {
								response.status(200).render("error", {message: this.message.already_logged_in, status: 200}); // already
							}

						}).catch((error: any) => {
							response.status(500).render("error", error);
						});
					} else {
						response.status(200).render("error", {message: "Timeout", status: 200}); // timeout
					}
				} else {
					response.status(500).render("error", error);
				}
			});
		} catch (error) {
			response.status(500).render("error", error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_immediate_password(request: IContentRequest, response: IJSONResponse): void {
		try {
			Auth.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
				this.ifSuccess(response, error, (): void => {
					const username: string = value.username;
					LocalAccount.default_find_by_name_promise({}, username).then((account: any): void => {
						if (account) {
							if (account.enabled) {
								if (account.provider === "local") {　// OAuthは除外
									if (this.permit_for_change_account(request.user, account)) {
										const password: string = value.password;
										account.setPassword(password, (error: IErrorObject): void => {
											this.ifSuccess(response, error, (): void => {
												account._save((error: IErrorObject, obj: any): void => {
													this.ifSuccess(response, error, (): void => {
														this.SendSuccess(response, {});
													});
												});
											});
										});
									} else {
										this.SendWarn(response, this.errors[4]);
									}
								} else {
									this.SendWarn(response, this.errors[3]);
								}
							} else {
								this.SendError(response, this.errors[2]);
							}
						} else {
							this.SendWarn(response, this.errors[8]);
						}
					}).catch((error: any) => {
						this.SendError(response, error);
					});
				});
			});
		} catch (error) {
			this.SendFatal(response, error);
		}
	}


	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public post_local_remove(request: any, response: IJSONResponse): void {
		try {
			const operator: any = request.user;
			LocalAccount.default_find_by_id_promise({}, operator.user_id).then((account: any): void => {
				if (account) {
					if (account.enabled) {
						LocalAccount.remove_by_id_promise(null, operator.user_id).then(() => {
							request.logout();
							this.SendSuccess(response, null);
						}).catch((error: IErrorObject): void => {
							this.SendError(response, error);
						});
					} else {
						this.SendError(response, this.errors[2]);
					}
				} else {
					this.SendError(response, this.errors[8]);
				}
			}).catch((error: any) => {
				this.SendError(response, error);
			})

		} catch (error) {
			this.SendFatal(response, error);
		}
	}


	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public auth_facebook_callback(request: IUserRequest, response: IRedirectResponse): void {
		try {
			if (request.user) {
				const operator: IAccountModel = this.Transform(request.user);
				LocalAccount.default_find_by_name_promise({}, operator.username).then((account: any): void => {
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

						newAccount._save((error: IErrorObject, obj: any): void => {
							if (!error) {
								response.redirect("/");
							}
						});
					} else {
						response.redirect("/");
					}
				}).catch((error: any) => {
					this.SendError(response, error);
				})
			}
		} catch (error) {
			this.SendFatal(response, error);
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
			if (request.user) {
				const operator: IAccountModel = this.Transform(request.user);
				LocalAccount.default_find_by_name_promise({}, operator.username).then((account: any): void => {
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
						// newAccount.registerDate = Date.now();
						newAccount._save((error: IErrorObject, obj: any): void => {
							if (!error) {
								response.redirect("/");
							}
						});
					} else {
						response.redirect("/");
					}
				}).catch((error: any) => {
					this.SendError(response, error);
				})
			}
		} catch (error) {
			this.SendFatal(response, error);
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
			LocalAccount.default_find_by_name_promise({}, request.user.username).then((account: any): void => {
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
					// newAccount.registerDate = Date.now();              // Legacy of v1
					newAccount._save((error: IErrorObject, obj: any): void => {
						if (!error) {
							response.redirect("/");
						}
					});
				} else {
					// Auth.auth_event("login:twitter", request.user.username);
					response.redirect("/");
				}
			}).catch((error: any) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendFatal(response, error);
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
			LocalAccount.default_find_by_name_promise({}, request.user.username).then((account: any): void => {
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
					// newAccount.registerDate = Date.now();              // Legacy of v1
					newAccount._save((error: IErrorObject, obj: any): void => {
						if (!error) {
							// Auth.auth_event("auth:instagram", newAccount);
							response.redirect("/");
						}
					});
				} else {
					// Auth.auth_event("login:instagram", request.user.username);
					response.redirect("/");
				}

			}).catch((error: any) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendFatal(response, error);
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
			LocalAccount.default_find_by_name_promise({}, username).then((account: any): void => {
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
					newAccount._save((error: IErrorObject, obj: any): void => {
						if (!error) {
							// Auth.auth_event("auth:line", newAccount);
							response.redirect("/");
						}
					});
				} else {
					// Auth.auth_event("login:line", request.user.username);
					response.redirect("/");
				}
			}).catch((error: any) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendFatal(response, error);
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
			this.SendSuccess(response, {code: 0, message: ""});
		} catch (error) {
			this.SendFatal(response, error);
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
