/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {Errors} from "./errors";

const cipherCrypto: any = require("crypto");
// const NodeRSA: any = require("node-rsa");
const cipherMode: string = "aes-256-cbc";
const seed: string = "0123456789abcdef";

// const ConfigModule: any = require("../../../../config/default");
const ConfigModule: any = require("config");
const config: any = ConfigModule.systems;

const LocalAccount: any = require("../../../../models/platform/accounts/account");

/**
 * 暗号
 */
export class Cipher {

	/**
	 * @constructor
	 */
	constructor() {
	}

	/**
	 * MD5ダイジェスト
	 * @param data
	 * @returns ダイジェスト
	 */
	public static Md5(data: string): string {
		const md5hash: any = cipherCrypto.createHash("md5");
		md5hash.update(data);
		return md5hash.digest("hex");
	}

	/**
	 * 暗号化
	 * @param plain Plain
	 * @param password
	 * @returns Crypted
	 */
	public static FixedCrypt(plain: string, password: string): string {
		let crypted: string = "";
		try {
			const key: Buffer = Buffer.from(Cipher.Md5(password), "utf8");
			const iv: Buffer = Buffer.from(seed, "utf8");
			const cipher: any = cipherCrypto.createCipheriv(cipherMode, key, iv);
			crypted = cipher.update(plain, "utf8", "hex");
			crypted += cipher.final("hex");
		} catch (ex: any) {
			//        console.log(ex.message);
		}
		return crypted;
	}

	/**
	 * 復号
	 * @param crypted Crypted
	 * @param password
	 * @returns plain
	 */
	public static FixedDecrypt(crypted: string, password: string): string {
		let decrypted: string = "";
		try {
			const key: Buffer = Buffer.from(this.Md5(password), "utf8");
			const iv: Buffer = Buffer.from(seed, "utf8");
			const decipher: any = cipherCrypto.createDecipheriv(cipherMode, key, iv);
			decrypted = decipher.update(crypted, "hex", "utf8");
			decrypted += decipher.final("utf8");
		} catch (ex: any) {
			//        console.log(ex.message);
		}
		return decrypted;
	}

	/**
	 * KeyPair
	 * @param bits number
	 * @returns PublicKey
	 */
	public static KeyPair(bits: number): { private: string, public: string } {
		// 	const key: any = new NodeRSA({b: bits});
		// 	return {private: key.exportKey("pkcs1-private-pem"), public: key.exportKey("pkcs1-public-pem")};
		return {private: "", public: ""};
	}

	/**
	 * 暗号化
	 * @param publickey key
	 * @param plain Plain string
	 * @returns crypted text
	 */
	public static Encrypt(publickey: string, plain: string): string {
		// 	const rsa: any = new NodeRSA(publickey, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
		// 	return rsa.encrypt(plain, "base64");
		return plain;
	}

	/**
	 * 復号
	 * @param privatekey key
	 * @param crypted Plain string
	 * @returns plain text
	 */
	public static Decrypt(privatekey: string, crypted: string): string {
		// 	const rsa: any = new NodeRSA(privatekey, "pkcs1-private-pem", {encryptionScheme: "pkcs1_oaep"});
		// 	return rsa.decrypt(crypted, "utf8");
		return crypted;
	}

	/**
	 *
	 * @param username
	 * @param key
	 * @param callback
	 * @constructor
	 */
	public Token(username: string, key: string, callback: Callback<any>): void {
		LocalAccount.findOne({$and: [{provider: "local"}, {username}]}).then((account: any): void => {
			if (account) {
				const tokenObject: any = {username, key, timestamp: Date.now()};
				const encodedToken: any = Cipher.FixedCrypt(JSON.stringify(tokenObject), config.tokensecret);
				callback(null, encodedToken);
			} else {
				callback(Errors.userError(1, "account not found.", "S00361"), null);
			}
		}).catch((error: IErrorObject): void => {
			callback(error, null);
		});
	}

	/**
	 *
	 * @param encodedToken
	 * @param key
	 * @param callback
	 * @constructor
	 */
	public Account(encodedToken: string, key: string, callback: Callback<any>): void {
		try {
			const tokenString: string = Cipher.FixedDecrypt(encodedToken, config.tokensecret);
			const tokenObject: any = JSON.parse(tokenString);
			if (tokenObject.key === key) {
				LocalAccount.findOne({$and: [{provider: "local"}, {username: tokenObject.username}]}).then((account: any): void => {
					if (account) {
						callback(null, account);
					} else {
						callback(Errors.userError(1, "account not found.", "S00362"), null);
					}
				}).catch((error: IErrorObject): void => {
					callback(error, "");
				});
			} else {
				callback(Errors.userError(1, "auth fail.", "S00363"), null);
			}
		} catch (exept: any) {
			callback(exept, null);
		}
	}
}

module.exports = Cipher;
