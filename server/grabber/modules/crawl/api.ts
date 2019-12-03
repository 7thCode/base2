/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../../types/server";
import {Callback, IContent} from "../../../../types/universe";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const modules: string = global._modules;
const library: string = global._library;
const _config: string = global.__config;

const gatekeeper: any = require(path.join(library, "gatekeeper"));
// const Auth: any = require(path.join(modules, "auth/controller"));
// const auth: any = new Auth(module.parent.exports.event);

const Crawl: any = require("./controller");
const crawls: any = new Crawl(module.parent.exports.event);

router.get("/grabber/crawl", function(request, response, next) {

	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	response.write("<div>ok</div>");
	response.end();

	crawls.crawl(request, response);

});

module.exports = router;
