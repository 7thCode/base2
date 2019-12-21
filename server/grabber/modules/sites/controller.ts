/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IArticleModel} from "../../../../types/platform/server";

const path: any = require("path");

const controllers: string = global._controllers;
const models: string = global._models;

const Updatable: any = require(path.join(controllers, "updatable_controller"));

const Site: any = require(path.join(models, "platform/grabber/sites/site"));

export class Sites extends Updatable {

	protected Model: any;

	constructor(event: any) {
		super(event);
		this.Model = Site as IArticleModel;
	}

}

module.exports = Site;