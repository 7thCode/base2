/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";

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

	/**
	 *
	 *
	 */
	public zip_to_address(req: any, response: IJSONResponse): void {

		const zip: string = req.params.zip;
		const get_options: any = {
			url: "https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + zip,
			method: "GET",
			json: true,
		};

		request(get_options, (error: IErrorObject, from_receiver: any, body: any): void => {
			if (!error) {
				if (body.status === 200) {
					if (body.results.length > 0) {
						this.SendSuccess(response, body.results[0]);
					} else {
						this.SendError(response, {code: -1, message: ""});
					}
				} else {
					this.SendError(response, error);
				}
			} else {
				this.SendError(response, error);
			}
		});
	}

}

module.exports = ExtServices;
