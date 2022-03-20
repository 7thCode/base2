/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";
import {Errors} from "../../../platform/base/library/errors";

const Wrapper: any = require("../../../platform/base/controllers/wrapper");

const request: any = require("request");

export class ExtServices extends Wrapper {

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
	}


	private wide_to_single(strVal: string): string {

		const halfVal = strVal.replace(/[！-～]/g,
			(tmpStr) => {
				return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
			}
		);

		return halfVal.replace(/”/g, "\"")
			.replace(/’/g, "'")
			.replace(/‘/g, "`")
			.replace(/￥/g, "\\")
			.replace(/　/g, " ")
			.replace(/〜/g, "~");
	}

	private normalize_postal(code: string): string {
		let result: string = "";
		for (let index = 0; index < code.length; index++) {
			const char = code.charAt(index);
			if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(char) >= 0) {
				result += char;
			}
		}
		return result;
	}

	/**
	 *
	 *
	 */
	public zip_to_address(req: any, response: IJSONResponse): void {
		try {
			const zip: string = req.params.zip;
			const clean_zip: string = this.normalize_postal(this.wide_to_single(zip));

			const get_options: any = {
				url: "https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + clean_zip,
				method: "GET",
				json: true,
			};

			request(get_options, (error: IErrorObject, from_receiver: any, body: any): void => {
				if (!error) {
					if (body) {
						if (body.status === 200) {
							if (body.results) {
								if (body.results.length > 0) {
									this.SendSuccess(response, body.results[0]);
								} else {
									this.SendError(response, Errors.generalError(-1, "住所が見つかりません。", "S00450"));
								}
							} else {
								this.SendError(response, Errors.generalError(-1, "住所が見つかりません。", "S00451"));
							}
						} else {
							this.SendError(response, Errors.generalError(-1, body.message, "S00452"));
						}
					} else {
						this.SendError(response, Errors.generalError(-1, "不明なエラー。", "S00453"));
					}
				} else {
					this.SendError(response, Errors.generalError(-1, "不明なエラー。", "S00454"));
				}
			});
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00385"));
		}

	}

}

module.exports = ExtServices;
