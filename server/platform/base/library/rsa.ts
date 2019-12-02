/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const NodeRSA: any = require("node-rsa");

export class Rsa {

		private key: any;

		constructor(bits: number) {
				this.key = new NodeRSA({b: bits});
		}

		public PrivateKey(): string {
				return this.key.exportKey("pkcs1-private-pem");
		}

		public PublicKey(): string {
				return this.key.exportKey("pkcs1-public-pem");
		}

		public Encrypt(key: string, input: string): string {
				const rsa = new NodeRSA(key, "pkcs1-public-pem", {encryptionScheme: "pkcs1_oaep"});
				return rsa.encrypt(input, "base64");
		}

		public Decrypt(key: string, input: string): string {
				const rsa = new NodeRSA(key, "pkcs1-private-pem", {encryptionScheme: "pkcs1_oaep"});
				return rsa.decrypt(input, "utf8");
		}

}

module.exports = Rsa;
