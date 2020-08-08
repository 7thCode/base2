/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

export class Result {
	private code: number;
	private message: string;
	private value: any;

	/**
	 *
	 * @param code
	 * @param message
	 * @param value
	 */
	constructor(code: number, message: string, value: any) {
		this.code = code;
		this.message = message;
		this.value = value;
	}
}

module.exports = Result;
