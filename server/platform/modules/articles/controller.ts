/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IArticleModel} from "../../../../types/platform/server";

const path: any = require("path");

const project_root: string = process.cwd();
const controllers: string = path.join(project_root, "server/platform/base/controllers");
const models: string = path.join(project_root, "models");

const Updatable: any = require(path.join(controllers, "updatable_controller"));

const Article: any = require(path.join(models, "platform/articles/article"));

export class Articles extends Updatable {

	protected Model: any;

	/**
	 * @param event
	 * @param config
	 * @param logger
	 */
	constructor(event: any, config: object, logger: object) {
		super(event, config, logger);
		this.Model = Article as IArticleModel;
	}

}

module.exports = Articles;
