/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {
	IAccountContent,
	IAccountModel,
	IAccountRequest,
	IJSONResponse,
	IQueryParam,
	IQueryRequest,
	IUsernameParam,
} from "../../../../types/server";

import {IErrorObject, IQueryOption} from "../../../../types/universe";

const _: any = require("lodash");
const SpeakEasy: any = require("speakeasy");
const QRCode: any = require("qrcode");

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const Wrapper: any = require(path.join(controllers, "wrapper"));

const Crawler = require("../../base/library/crawler").Crawler;

const Src: any = require(path.join(models, "grabber/srces/src"));

export class Crawls extends Wrapper {

	constructor(event: any) {
		super(event);
	}

	public crawl(request: IAccountRequest<any>, response: IJSONResponse): void {
		const current_user: IAccountModel = this.Transform(request.user);
		const crawler = new Crawler({ignore_ext: [".jpg", ".jpeg", ".png", ".mp4"], multiplicity: 4});
		crawler.Crawl("https://motociclistagiapponese.com/", (error, result: { event: string, url: string, images: any[], queue: number }) => {
			if (!error) {
				switch (result.event) {
					case "resolve":
						console.log("queue: " + result.queue + "  url: " + result.url);
						if (result.images) {
							result.images.forEach((element) => {

								const src = element.attr("src");
								let src_text = "";
								if (src) {
									src_text = src.value();
								}

								const alt = element.attr("alt");
								let alt_text = "";
								if (alt) {
									alt_text = alt.value();
								}

								const setter = {
									content: {
										id: "",
										src: src_text,
										alt: alt_text,
										url: result.url,
										description: "",
									},
								};

								Src.set(current_user, src_text, setter);
							});
						}
						break;
					case "end":
						console.log("end");
						break;
				}
			} else {
				console.log(error.message);
			}
		});
	}

}

module.exports = Crawls;
