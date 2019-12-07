/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/universe";

import {IJSONResponse} from "../../../../types/server";

const _: any = require("lodash");
const fs: any = require("graceful-fs");
const pug: any = require("pug");

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const Wrapper: any = require("./wrapper");

const Mailer: any = require(path.join(library, "mail_sender"));
const Mailer2: any = require(path.join(library, "mail_sender_2"));
const MailGun: any = require(path.join(library, "mail_sender_mailgun"));
const config: any = require(path.join(_config, "default")).systems;

export class Mail extends Wrapper {

	protected message: any;
	private mailer: any = null;
	private bcc: string | any[] = "";

	constructor(event: any) {
		super(event);
		this.message = config.message;
		const mailerSetting = config.mailer;

		switch (mailerSetting.type) {
			case "mail":
				this.mailer = new Mailer(mailerSetting.setting, mailerSetting.account);
				this.bcc = "";
				break;
			case "gmail":
				this.mailer = new Mailer2(mailerSetting.setting, mailerSetting.account);
				this.bcc = "";
				break;
			case "mailgun":
				this.mailer = new MailGun(mailerSetting.setting, mailerSetting.account);
				this.bcc = [];
				break;
			default:
				this.mailer = new Mailer2(mailerSetting.setting, mailerSetting.account);
				this.bcc = "";
				break;
		}
	}

	protected send_mail(mailConfig: any, response: IJSONResponse): void {
		fs.readFile(path.join(process.cwd(), mailConfig.template_url), "utf8", (error: IErrorObject, data: any): void => {
			this.ifSuccess(response, error, (): void => {
				const doc: any = pug.render(data, {content: mailConfig.souce_object, link: mailConfig.link});
				this.mailer.send(mailConfig.address, mailConfig.bcc, mailConfig.title, doc, (error: IErrorObject): void => {
					this.ifSuccess(response, error, (): void => {
						this.SendSuccess(response, mailConfig.result_object);
					});
				});
			});
		});
	}

}

module.exports = Mail;
