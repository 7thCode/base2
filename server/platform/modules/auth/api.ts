/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IEncoded, IErrorObject} from "../../../../types/platform/universe";

const express: any = require("express");
export const router = express.Router();

const passport: any = require("passport");

passport.serializeUser((user: any, done: any): void => {
	done(null, user);
});

passport.deserializeUser((user: any, done: any): void => {
	done(null, user);
});

const LocalStrategy: any = require("passport-local").Strategy;
const FacebookStrategy: any = require("passport-facebook").Strategy;
const AppleStrategy: any = require("passport-apple");
const TwitterStrategy: any = require("passport-twitter").Strategy;
const InstagramStrategy: any = require("passport-instagram").Strategy;
const LineStrategy: any = require("passport-line").Strategy;

const event = module.parent.exports.event;

const logger: any = module.parent.exports.logger;

const ConfigModule: any = module.parent.exports.config;
const systemsConfig: any = ConfigModule.systems;
const usersConfig: any = ConfigModule.users;

const Cipher: any = require("../../base/library/cipher");
const IPV6: any = require("../../base/library/ipv6");
const gatekeeper: any = require("../../base/library/gatekeeper");
const LocalAccount: any = require("../../../../models/platform/accounts/account");

const Auth: any = require("./controller");
const auth: any = new Auth(event, ConfigModule, logger, passport);

passport.use(new LocalStrategy(LocalAccount.authenticate()));

if (systemsConfig.facebook) {
	passport.use(new FacebookStrategy(systemsConfig.facebook.key, (accessToken: string, refreshToken: string, profile: any, done: any): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.apple) {
	const config: any = systemsConfig.apple.key;
	const keyFile: any = systemsConfig.apple.KeyFile;
	config.privateKeyPath = __dirname + "/" + keyFile;
	passport.use(new AppleStrategy(config, (accessToken: string, refreshToken: string, profile: any, done: any): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.twitter) {
	passport.use(new TwitterStrategy(systemsConfig.twitter.key, (accessToken: string, refreshToken: string, profile: any, done: any): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.instagram) {
	passport.use(new InstagramStrategy(systemsConfig.instagram.key, (accessToken: string, refreshToken: string, profile: any, done: any): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.line) {
	passport.use(new LineStrategy(systemsConfig.line.key, (accessToken: string, refreshToken: string, profile: any, done: any): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

// if (config.google) {
// 	passport.use(new GoogleStrategy(config.google.key, (accessToken, refreshToken, profile, done): void => {
// 			process.nextTick((): void => {
// 				done(null, profile);
// 			});
// 		},
// 	));
// }


const init_users: any[] = [];

if (systemsConfig.initusers) {
	systemsConfig.initusers.forEach((user: any): void => {
		init_users.push(user);
	});
}

if (usersConfig.initusers) {
	usersConfig.initusers.forEach((user: any): void => {
		init_users.push(user);
	});
}

auth.init(init_users, (error: IErrorObject, result: any): void => {
	if (!error) {

		// for Preflight request. (CORS)
		router.options("*", [gatekeeper.default]);

		router.get("/auth/local/is_logged_in", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.is_logged_in(request, response);
				});
			}]);

		router.post("/auth/local/login", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_login(request, response);
				});
			}]);

		router.post("/auth/local/login_totp", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_login_totp(request, response);
				});
			}]);

		router.get("/auth/token/qr/:token", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.get_login_token(request, response);
				});
			}]);

		router.post("/auth/token/login", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_login(request, response);
				});
			}]);


		router.post("/auth/local/register", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_register(request, response);
				});
			}]);

		router.get("/auth/register/:token", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.get_register_token(request, response);
				});
			}]);

		router.post("/auth/immediate/register", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object, next: any): void => {
				auth.is_manager(request, response, next);
			},
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_immediate_register(request, response);
				});
			}]);


		router.post("/auth/local/password", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_password(request, response);
				});
			}]);

		router.get("/auth/password/:token", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.get_password_token(request, response);
				});
			}]);

		router.post("/auth/immediate/password", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object, next: any): void => {
				auth.is_manager(request, response, next);
			},
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_immediate_password(request, response);
				});
			}]);


		router.post("/auth/local/username", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_username(request, response);
				});
			}]);

		router.get("/auth/username/:token", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.get_username_token(request, response);
				});
			}]);

		router.post("/auth/immediate/username", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object, next: any): void => {
				auth.is_manager(request, response, next);
			},
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_immediate_username(request, response);
				});
			}]);

		router.post("/auth/local/remove", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_local_remove(request, response);
				});
			}]);

		router.get("/auth/remove/:token", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.get_remove_token(request, response);
				});
			}]);

		router.post("/auth/immediate/remove", [gatekeeper.default, gatekeeper.authenticate,
			(request: object, response: object, next: any): void => {
				auth.is_manager(request, response, next);
			},
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.post_immediate_remove(request, response);
				});
			}]);


		router.get("/auth/logout", [gatekeeper.default, gatekeeper.authenticate,
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.logout(request, response);
				});
			}]);

		// facebook
		router.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email"]}));
		router.get("/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/"}),
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.auth_facebook_callback(request, response);
				});
			});

		// apple
		router.get("/auth/apple", passport.authenticate("apple", {scope: ["email"]}));
		router.get("/auth/apple/callback", passport.authenticate("apple", {failureRedirect: "/"}),
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.auth_apple_callback(request, response);
				});
			});

		// twitter
		router.get("/auth/twitter", passport.authenticate("twitter"));
		router.get("/auth/twitter/callback", passport.authenticate("twitter", {failureRedirect: "/"}),
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.auth_twitter_callback(request, response);
				});
			});

		// instagram
		router.get("/auth/instagram", passport.authenticate("instagram"));
		router.get("/auth/instagram/callback", passport.authenticate("instagram", {failureRedirect: "/"}),
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.auth_instagram_callback(request, response);
				});
			});

		// line
		router.get("/auth/line", passport.authenticate("line"));
		router.get("/auth/line/callback", passport.authenticate("line", {failureRedirect: "/"}),
			(request: any, response: object): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					auth.auth_line_callback(request, response);
				});
			});

		// test
		/*
		router.get("/auth/mail/regist_mail", [gatekeeper.page_catch,
			(request: any, response: any): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					response.render("platform/auth/mail/regist_mail", {config: systemsConfig, link: ""});
				});
			}]);

		router.get("/auth/mail/password_mail", [gatekeeper.page_catch,
			(request: any, response: any): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					response.render("platform/auth/mail/password_mail", {config: systemsConfig, link: ""});
				});
			}]);
*/


		router.post("/receive", [gatekeeper.default,
			(request: any, response: object): void => {
				logger.trace(request.url);
			}]);

		const TCipher: any = Cipher;
		const cipher = new TCipher();

		const TIPV6: any = IPV6;
		const ipv6: any = TIPV6;

		router.get("/auth/token/make", [gatekeeper.default,
			(request: any, response: any): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					const key = ipv6.GetIPV6(request); // IP制限の場合
					const userName = "oda.mikio@gmail.com";
					cipher.Token(userName, key, (error: IErrorObject, tokenByUser: string): void => {
						if (!error) {
							response.send(tokenByUser);
						} else {
							response.send(error.message);
						}
					});
				});

			}]);

		router.get("/auth/token/enc/:token/:plain", [gatekeeper.default,
			(request: any, response: any): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					const key: string = ipv6.GetIPV6(request); // IP制限の場合
					const token: string = request.params.token;
					const plain: string = request.params.plain;

					cipher.Account(token, key, (error: IErrorObject, account: { publickey: string }): void => {
						if (!error) {
							if (account) {
								const cipher: string = Cipher.Encrypt(account.publickey, plain);
								response.send(encodeURIComponent(cipher));
							} else {
								response.send("NG");
							}
						} else {
							response.send(error.message);
						}
					});
				});

			}]);

		router.get("/auth/token/dec/:token/:cipher", [gatekeeper.default,
			(request: any, response: any): void => {
				logger.trace(request.url);
				gatekeeper.catch(response, (): void => {
					const key: string = ipv6.GetIPV6(request); // IP制限の場合
					const token: string = request.params.token;
					const cipherString: string = decodeURIComponent(request.params.cipher);

					cipher.Account(token, key, (error: IErrorObject, account: { privatekey: string }): void => {
						if (!error) {
							if (account) {
								const plaintext: string = Cipher.Decrypt(account.privatekey, cipherString);
								response.send(plaintext);
							} else {
								response.send("NG");
							}
						} else {
							response.send(error.message);
						}
					});
				});
			}]);

// api test
//
// http://localhost:3000/auth/test

		router.get("/auth/test", (request: any, response: any): void => {

			// let key = "opensesame";         //secret文字列の場合
			const key = ipv6.GetIPV6(request); // IP制限の場合

			//  token by user

			const userName = "oda.mikio@gmail.com";
			cipher.Token(userName, key, (error: IErrorObject, tokenByUser: string): void => {
				if (!error) {
					// console.info(tokenByUser); // create token.

					//
					//
					//
					//
					//

					// use token
					// by_user token to by_user passphrase
					cipher.Account(tokenByUser, key, (error: IErrorObject, account: any): void => {
						if (!error) {
							if (account) {
								// encode
								const crypted: IEncoded = Cipher.Encrypt(account.publickey, "hoge");

								//
								//
								//
								//
								//

								// decode
								const plaintext: string = Cipher.Decrypt(account.privatekey, crypted);

								//
								//
								//
								//
								//

								response.send(plaintext);
							}
						}
					});
				}
			});
		});

	} else {
		logger.fatal("init error. (auth) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
