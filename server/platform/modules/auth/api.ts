/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IEncoded, IErrorObject} from "../../../../types/universe";

const express: any = require("express");
export const router = express.Router();

const passport: any = require("passport");

passport.serializeUser((user: any, done): void => {
	done(null, user);
});

passport.deserializeUser((user, done): void => {
	done(null, user);
});

const LocalStrategy: any = require("passport-local").Strategy;
const FacebookStrategy: any = require("passport-facebook").Strategy;
const AppleStrategy: any = require("passport-appleid").Strategy;
const TwitterStrategy: any = require("passport-twitter").Strategy;
const InstagramStrategy: any = require("passport-instagram").Strategy;
const LineStrategy: any = require("passport-line").Strategy;

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const log4js: any = require("log4js");
log4js.configure(path.join(_config, "platform/logs.json"));
const logger: any = log4js.getLogger("request");

const ConfigModule: any = require(path.join(_config, "default"));
const systemsConfig: any = ConfigModule.systems;
const usersConfig: any = ConfigModule.users;

const Cipher: any = require(path.join(library, "cipher"));
const IPV6: any = require(path.join(library, "ipv6"));
const gatekeeper: any = require(path.join(library, "gatekeeper"));
const LocalAccount: any = require(path.join(models, "platform/accounts/account"));

const Auth: any = require("./controller");
const auth: any = new Auth(module.parent.exports.event, passport);

passport.use(new LocalStrategy(LocalAccount.authenticate()));

if (systemsConfig.facebook) {
	passport.use(new FacebookStrategy(systemsConfig.facebook.key, (accessToken, refreshToken, profile, done): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.apple) {
	const config: any = systemsConfig.apple.key;
	config.privateKeyPath = path.join(__dirname, "");
	passport.use(new AppleStrategy(config, (accessToken, refreshToken, profile, done): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.twitter) {
	passport.use(new TwitterStrategy(systemsConfig.twitter.key, (accessToken, refreshToken, profile, done): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.instagram) {
	passport.use(new InstagramStrategy(systemsConfig.instagram.key, (accessToken, refreshToken, profile, done): void => {
		process.nextTick((): void => {
			done(null, profile);
		});
	}));
}

if (systemsConfig.line) {
	passport.use(new LineStrategy(systemsConfig.line.key, (accessToken, refreshToken, profile, done): void => {
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


const init_users = [];

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

		router.post("/auth/local/login", [gatekeeper.guard,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.post_local_login(request, response);
				});
			}]);

		router.post("/auth/local/login_totp", [gatekeeper.guard,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.post_local_login_totp(request, response);
				});
			}]);

		router.post("/auth/local/register", [gatekeeper.guard,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.post_local_register(request, response);
				});
			}]);

		router.post("/auth/immediate/register", [gatekeeper.guard, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.post_immediate_register(request, response);
				});
			}]);

		router.get("/auth/register/:token", [
			(request: { params: { token: string } }, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.get_register_token(request, response);
				});
			}]);

		router.post("/auth/local/password", [gatekeeper.guard,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.post_local_password(request, response);
				});
			}]);

		router.post("/auth/immediate/password", [gatekeeper.guard, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.post_immediate_password(request, response);
				});
			}]);

		router.get("/auth/password/:token", [
			(request: { params: { token: string } }, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.get_password_token(request, response);
				});
			}]);

		router.get("/auth/logout", [gatekeeper.guard, gatekeeper.authenticate,
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.logout(request, response);
				});
			}]);

		// facebook
		router.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email"]}));
		router.get("/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/"}),
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.auth_facebook_callback(request, response);
				});
			});

		// apple
		router.get("/auth/apple", passport.authenticate("apple", {scope: ["email"]}));
		router.get("/auth/apple/callback", passport.authenticate("apple", {failureRedirect: "/"}),
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.auth_apple_callback(request, response);
				});
			});

		// twitter
		router.get("/auth/twitter", passport.authenticate("twitter"));
		router.get("/auth/twitter/callback", passport.authenticate("twitter", {failureRedirect: "/"}),
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.auth_twitter_callback(request, response);
				});
			});

		// instagram
		router.get("/auth/instagram", passport.authenticate("instagram"));
		router.get("/auth/instagram/callback", passport.authenticate("instagram", {failureRedirect: "/"}),
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.auth_instagram_callback(request, response);
				});
			});

		// line
		router.get("/auth/line", passport.authenticate("line"));
		router.get("/auth/line/callback", passport.authenticate("line", {failureRedirect: "/"}),
			(request: object, response: object): void => {
				gatekeeper.catch(response, (): void => {
					auth.auth_line_callback(request, response);
				});
			});

		// test
		router.get("/auth/mail/regist_mail", [gatekeeper.page_catch,
			(request: object, response: any): void => {
				gatekeeper.catch(response, (): void => {
					response.render("platform/auth/mail/regist_mail", {config: systemsConfig, link: ""});
				});
			}]);

		router.get("/auth/mail/password_mail", [gatekeeper.page_catch,
			(request: object, response: any): void => {
				gatekeeper.catch(response, (): void => {
					response.render("platform/auth/mail/password_mail", {config: systemsConfig, link: ""});
				});
			}]);

		const TCipher: any = Cipher;
		const cipher = new TCipher();

		const TIPV6: any = IPV6;
		const ipv6: any = TIPV6;

		router.get("/auth/token/make", (request: object, response: any): void => {
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

		});

		router.get("/auth/token/enc/:token/:plain", (request: { params: { token: string, plain: string } }, response: any): void => {
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

		});

		router.get("/auth/token/dec/:token/:cipher", (request: { params: { token: string, cipher: string } }, response: any): void => {
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

		});

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
					console.info(tokenByUser); // create token.

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
		console.error("init error. (auth) " + error.message);
		logger.fatal("init error. (auth) ", error.message);
		process.exit(1);
	}
});

module.exports = router;
