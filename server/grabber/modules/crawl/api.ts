/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../../types/platform/server";
import {Callback, IContent} from "../../../../types/platform/universe";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const modules: string = global._modules;
const library: string = global._library;
const _config: string = global.__config;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const Crawl: any = require("./controller");
const crawls: any = new Crawl(module.parent.exports.event);

router.get("/srcs/auth/query/:query/:option", [
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			crawls.query(request, response);
		});
	}]);

router.get("/srcs/auth/count/:query", [
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			crawls.count(request, response);
		});
	}]);

router.get("/srcs/crawl", function(request, response, next) {

	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	response.write("<div>ok</div>");
	response.end();

	crawls.crawl(request, response);

});

module.exports = router;
