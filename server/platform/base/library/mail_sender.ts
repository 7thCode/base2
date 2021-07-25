/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IMailSender, IMailSenderModule} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";
import {Errors} from "./errors";

export class MailSender implements IMailSenderModule {

	private mailer: any;
	private readonly mailsetting: any;
	private smtpUser: any;
	private readonly account: any;

	/**
	 *
	 * @param mailsetting
	 * @param mailaccount
	 * @constructor
	 */
	constructor(mailsetting: any, mailaccount: string) {
		this.mailer = require("nodemailer");
		this.account = mailaccount;
		this.mailsetting = mailsetting;
	}

	/**
	 *
	 * @param mailAddress
	 * @param bccAddress
	 * @param title
	 * @param text_message
	 * @param html_message*
	 * @param callback
	 * @returns none
	 */
	public send(mailAddress: string, bccAddress: string, title: string, text_message: string, html_message: string, callback: (error: IErrorObject) => void): void {

		this.smtpUser = this.mailer.createTransport(this.mailsetting); // SMTPの接続

		if (this.smtpUser) {
			const resultMail: IMailSender = {
				from: this.account,
				to: mailAddress,
				bcc: bccAddress,
				subject: title,
				text: text_message,
				html: html_message,
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
			callback(Errors.generalError(1, "send error.", "S00177"));
		}
	}
}

module.exports = MailSender;
