/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

// const NodeRSA: any = require("node-rsa");

export class Rsa {

	private key: any;

	/**
	 *
	 * @param bits
	 */
	constructor(bits: number) {
	// 	this.key = new NodeRSA({b: bits});
	}

	/**
	 *
	 * @constructor
	 */
	public PrivateKey(): string {
	// 	return this.key.exportKey("pkcs1-private-pem");
		return "";
	}

	/**
	 *
	 * @constructor
	 */
	public PublicKey(): string {
	// 	return this.key.exportKey("pkcs1-public-pem");
		return "";
	}

	/**
	 *
	 * @param key
	 * @param input
	 * @constructor
	 */
	public Encrypt(key: string, input: string): string {
	// 	const rsa = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
	// 	return rsa.encrypt(input, "base64");
		return input;
	}

	/**
	 *
	 * @param key
	 * @param input
	 * @constructor
	 */
	public Decrypt(key: string, input: string): string {
	// 	const rsa = new NodeRSA(key, "pkcs1-private-pem", {encryptionScheme: "pkcs1_oaep"});
	// 	return rsa.decrypt(input, "utf8");
		return input;
	}

}

module.exports = Rsa;
