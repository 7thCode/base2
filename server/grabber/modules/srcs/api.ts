/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router: any = express.Router();

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const modules: string = global._modules;
const library: string = global._library;
const _config: string = global.__config;

const event = module.parent.exports.event;
const logger: any = module.parent.exports.logger;
const ConfigModule: any = module.parent.exports.config;

const gatekeeper: any = require(path.join(library, "gatekeeper"));

const Src: any = require("./controller");
const srcs: any = new Src(event, ConfigModule, logger);

router.get("/srcs/auth/query/:query/:option", [
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			srcs.query(request, response);
		});
	}]);

router.get("/srcs/auth/count/:query", [
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			srcs.count(request, response);
		});
	}]);

router.get("/srcs/crawl/:site_id", [
	(request, response, next) => {

		response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		response.write("<div>ok</div>");
		response.end();

		gatekeeper.catch(response, () => {
			srcs.crawl(request, response);
		});
	}]);

module.exports = router;
