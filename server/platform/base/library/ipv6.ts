/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const V6Module: any = require("ipv6");

const v6: any = V6Module.v6;

export class IPV6 {

	public static ToIPV6(address: string): string {
		let result: string = address;
		const v6Address: any = new v6.Address(result);
		if (!v6Address.isValid()) {
			if (v6Address.is4()) {
				result = "::ffff:" + result;
			} else {
				result = "::ffff:0.0.0.0";
			}
		}
		return result;
	}

	public static GetIPV6(request: any): string {
		let result: string = "::ffff:0.0.0.0";
		if (request.headers["x-forwarded-for"]) {
			result = IPV6.ToIPV6(request.headers["x-forwarded-for"]);
		} else if (request.connection) {
			if (request.connection.remoteAddress) {
				result = IPV6.ToIPV6(request.connection.remoteAddress);
			} else if (request.connection.socket) {
				if (request.connection.socket.remoteAddress) {
					result = IPV6.ToIPV6(request.connection.socket.remoteAddress);
				}
			}
		} else if (request.socket) {
			if (request.socket.remoteAddress) {
				result = IPV6.ToIPV6(request.socket.remoteAddress);
			}
		}
		return result;
	}
}

module.exports = IPV6;
