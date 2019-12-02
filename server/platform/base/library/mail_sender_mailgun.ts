/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IMailModule, IMailSender} from "../../../../types/server";
import {IErrorObject} from "../../../../types/universe";

export class MailSenderMailgun implements IMailModule {

	private account: any;
	private apiKey: string;
	private domain: any;
	private mailgun: any;

	constructor(mailsetting: any, mailaccount: string) {
		this.account = mailaccount;
		this.apiKey = mailsetting.api_key;
		this.domain = mailsetting.domain;
		this.mailgun = require("mailgun-js")({apiKey: this.apiKey, domain: this.domain});
	}

	public send(mailAddress: string, bccAddress: string, title: string, message: string, callback: (error: IErrorObject) => void): void {

		const data: IMailSender = {
			from: this.account,
			to: mailAddress,
			bcc: bccAddress,
			subject: title,
			html: message,
		};

		this.mailgun.messages().send(data, (error: IErrorObject, body: any): void => {
			callback(error);
		});
	}
}

module.exports = MailSenderMailgun;
