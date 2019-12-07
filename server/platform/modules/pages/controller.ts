/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/universe";

import {IPageModel} from "../../../../types/server";

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;

const Updatable: any = require(path.join(controllers, "updatable_controller"));

const Page: any = require(path.join(models, "platform/pages/page"));

export class Pages extends Updatable {

	protected Model: any;

	constructor(event: object) {
		super(event);
		this.Model = Page as IPageModel;
	}

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

	// protected default_user(user: IAccountModel): any {
	// 	let result: any = user;
	// 	if (!result) {
	// 		result = {
	// 			user_id: config.default.user_id,
	// 			auth: 100000,
	// 		};
	// 	}
	// 	return result;
	// }
}

module.exports = Pages;
