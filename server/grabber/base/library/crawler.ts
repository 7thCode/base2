/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const url_module = require("url");
const path = require("path");
const semaphore = require("semaphore");

const http = require("http");
const https = require("https");

const _ = require("lodash");

const libxmljs = require("libxmljs");

export class Crawler {

	private config: any;
	private sem: any = null;
	private collection: any = {};
	private queue: number = 0;

	constructor(config: any) {
		this.config = config;
		this.sem = semaphore(this.config.multiplicity);	// 並列数。増やしすぎるとリソースが足らない。
		this.collection = {};
		this.queue = 0;
	}

	private static is_not_include(value: string, is: string[], callback: (error, result) => void): void {
		if (_.indexOf(is, value) < 0) {
			callback(null, null);
		}
	}

	private static file_ext(file_name: string): string {
		let result = "";
		if (file_name) {
			result = path.extname(file_name);
		}
		return result;
	}

	private static file_name(target_url: URL): string {
		let result = "";
		const full_path = target_url.pathname;
		if (full_path) {
			const path_array = full_path.split("/");
			if (path_array.length > 0) {
				result = path_array[path_array.length - 1];
			}
		}
		return result;
	}

	private static host_name(target_url: URL): string {
		return target_url.host;
	}

	private static normalize(target_url: URL): string {
		target_url.hash = "";
		target_url.search = "";
		return target_url.href;
	}

	private static protocol_name(target_url: URL): string {
		return target_url.protocol;
	}

	private static extract_links(html_string: string, callback: (error, result: { links: any, images: any }) => void): void {
		const html_doc = libxmljs.parseHtmlString(html_string);
		try {
			const links = html_doc.find("//a");
			const images = html_doc.find("//img");
			callback(null, {links, images});
		} catch (error) {
			callback(error, null);
		}
	}

	private static resolve_links(links: any[], absolute_url: string): any {
		const dictionary = {};
		if (links) {
			links.forEach((link) => {
				const href = link.attr("href");
				if (href) {
					const relative_url = href.value();
					const resolved = url_module.resolve(absolute_url, relative_url);
					dictionary[resolved] = true;
				}
			});
		}
		return dictionary;
	}

	private one_page(collection, domain, url, callback: (error, page: { event: string, url: string, images: any[], queue: number }) => void): void {
		try {
			const target_url: URL = new URL(url);
			const normalize_url: string = Crawler.normalize(target_url);
			if (!collection[normalize_url]) {
				collection[normalize_url] = true;
				if (Crawler.host_name(target_url) === domain) {
					Crawler.is_not_include(Crawler.file_ext(Crawler.file_name(target_url)), this.config.ignore_ext, (error, result) => {
						let network = null;
						const protocol = Crawler.protocol_name(target_url);
						switch (protocol) {
							case "http:":
								network = http;
								break;
							case "https:":
								network = https;
								break;
							default:
						}

						if (network) {
							this.queue++;
							this.sem.take(() => {
								try {
									const req = network.request(normalize_url, (res) => {
										const parts_box = [];
										res.on("data", (parts) => {
											parts_box.push(parts);
										});
										res.on("end", () => {
											const html_string = Buffer.concat(parts_box).toString();
											if (html_string) {
												if ((res.statusCode === 200)) {
													Crawler.extract_links(html_string, (error, result) => {
														if (!error) {
															callback(null, {
																event: "resolve",
																url: normalize_url,
																images: result.images,
																queue: this.queue,
															});

															const dictionary = Crawler.resolve_links(result.links, normalize_url);
															const keys = Object.keys(dictionary);
															keys.forEach((url) => {
																this.one_page(collection, domain, url, callback);
															});
														} else {
															callback(error, null);
														}
													});
												}
											}
											this.queue--;
											if (this.queue === 0) {
												callback(null, {
													event: "end",
													url: "",
													images: [],
													queue: this.queue,
												});
											}
											this.sem.leave();
										});
									}).on("error", (error) => {
										callback(error, null);
										this.sem.leave();
									});
									req.end();
								} catch (error) {
									callback(error, null);
									this.sem.leave();
								}
							});
						}

					});
				}
			}
		} catch (error) {
			callback(error, null);
		}
	}

	public Crawl(url, callback: (error, result: { url: string, images: string[] }) => void) {
		const absolute_url = encodeURI(url);
		const target_url = new URL(absolute_url);
		const domain = target_url.host;
		this.one_page(this.collection, domain, absolute_url, callback);
	}

}
