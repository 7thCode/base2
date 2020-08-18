/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

import {IPageModel} from "../../../../types/platform/server";

const Updatable: any = require("../../../../server/platform/base/controllers/updatable_controller");

const Page: any = require("../../../../models/platform/pages/page");

export class Pages extends Updatable {

	protected Model: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: object, logger: object) {
		super(event, config, logger);
		this.Model = Page as IPageModel;
	}

	/**
	 *
	 * @param user_id
	 * @param path
	 * @param object
	 * @param callback
	 * @returns none
	 */
	protected getPage(user_id: string, path: string, object: any, callback: (error: IErrorObject, result: any, mimetype: string) => void): void {
		try {
			this.Model.get_page(user_id, path, object, (error: IErrorObject, result: string, mimetype: string): void => {
				if (!error) {
					callback(null, result, mimetype);
				} else {
					callback(error, "", "");
				}
			});
		} catch (error) {
			callback(error, null, "");
		}
	}

}

module.exports = Pages;
