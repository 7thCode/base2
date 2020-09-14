/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

import {IJSONResponse} from "../../../../types/platform/server";

// const _: any = require("lodash");
const fs: any = require("graceful-fs");
const pug: any = require("pug");

const path: any = require("path");

const project_root = path.join(__dirname, "../../../..");

const Wrapper: any = require("./wrapper");

const Mailer: any = require("../../../../server/platform/base/library/mail_sender");
const Mailer2: any = require("../../../../server/platform/base/library/mail_sender_2");
const MailGun: any = require("../../../../server/platform/base/library/mail_sender_mailgun");
const SendGrid: any = require("../../../../server/platform/base/library/mail_sender_sendgrid");

/**
 *
 */
export class Mail extends Wrapper {

	// protected message: any;
	private mailer: any = null;
	private bcc: string | any[] = "";

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: any, config: any, logger: object) {
		super(event, config, logger);
		// this.message = this.systemsConfig.message;
		const mailerSetting = this.systemsConfig.mailer;

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
			case "sendgrid":
				this.mailer = new SendGrid(mailerSetting.setting, mailerSetting.account);
				this.bcc = [];
				break;
			default:
				this.mailer = new Mailer2(mailerSetting.setting, mailerSetting.account);
				this.bcc = "";
				break;
		}
	}

	/**
	 * send mail
	 * @param mailConfig
	 * @param callback
	 * @returns none
	 */
	protected sendMail(mailConfig: any, callback:(error:IErrorObject, result: any) => void): void {
		fs.readFile(path.join(project_root, mailConfig.template_url), "utf8", (error: IErrorObject, data: any): void => {
			if (!error) {
				const doc: any = pug.render(data, {content: mailConfig.souce_object, link: mailConfig.link});
				this.mailer.send(mailConfig.address, mailConfig.bcc, mailConfig.title, doc, (error: IErrorObject): void => {
					if (!error) {
						callback(null, mailConfig.result_object);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

}

module.exports = Mail;
