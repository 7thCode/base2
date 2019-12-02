/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IMailModule, IMailSender} from "../../../../types/server";
import {IErrorObject} from "../../../../types/universe";

export class MailSender2 implements IMailModule {

	private smtpUser;
	private account;

	constructor(mailsetting: any, mailaccount: string) {
		const mailer: any = require("nodemailer");
		this.account = mailaccount;
		this.smtpUser = mailer.createTransport(mailsetting);
	}

	public send(mailAddress: string, bccAddress: string, title: string, message: string, callback: (error: IErrorObject) => void): void {

		if (this.smtpUser) {
			const resultMail: IMailSender = {
				from: this.account,
				to: mailAddress,
				bcc: bccAddress,
				subject: title,
				html: message,
			};

			try {
				this.smtpUser.sendMail(resultMail, (error: IErrorObject): void => {
					callback(error);
					this.smtpUser.close();
				});
			} catch (e) {
				callback(e);
			}
		} else {
			callback({code: -1, message: "send error"});
		}
	}
}

module.exports = MailSender2;
