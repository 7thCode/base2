/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IMailSender, IMailSenderModule} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";
import {Errors} from "./errors";

export class MailGMail implements IMailSenderModule {

	private readonly smtpUser: any;
	private readonly account: any;

	constructor(mailsetting: any, mailaccount: string) {
		const mailer: any = require("nodemailer");
		this.account = mailaccount;
		this.smtpUser = mailer.createTransport(mailsetting);
	}

	public send(mailAddress: string, bccAddress: string, title: string, text: string, html: string, callback: (error: IErrorObject) => void): void {

		if (this.smtpUser) {
			const resultMail: IMailSender = {
				from: this.account,
				to: mailAddress,
				bcc: bccAddress,
				subject: title,
				text: text,
				html: html,
			};

			try {
				this.smtpUser.sendMail(resultMail, (error: IErrorObject): void => {
					callback(error);
					this.smtpUser.close();
				});
			} catch (e: any) {
				callback(e);
			}
		} else {
			callback(Errors.configError(1, "config error.", "S00166"));
		}
	}
}

module.exports = MailGMail;
