/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {IArticleModel} from "../../../../types/server";

const path: any = require("path");

const controllers: string = global._controllers;
const models: string = global._models;

const Updatable: any = require(path.join(controllers, "updatable_controller"));

const Article: any = require(path.join(models, "platform/articles/article"));

export class Articles extends Updatable {

	protected Model: any;

	constructor(event: any) {
		super(event);
		this.Model = Article as IArticleModel;
	}

}

module.exports = Articles;
