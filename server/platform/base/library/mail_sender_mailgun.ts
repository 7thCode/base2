/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IMailSenderModule, IMailSender} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";

export class MailSenderMailgun implements IMailSenderModule {

	private account: any;
	private apiKey: string;
	private domain: any;
	private mailgun: any;

	/**
	 *
	 * @param mailsetting
	 * @param mailaccount
	 * @constructor
	 */
	constructor(mailsetting: any, mailaccount: string) {
		this.account = mailaccount;
		this.apiKey = mailsetting.api_key;
		this.domain = mailsetting.domain;
		this.mailgun = require("mailgun-js")({apiKey: this.apiKey, domain: this.domain});
	}

	/**
	 *
	 * @param mailAddress
	 * @param bccAddress
	 * @param title
	 * @param text
	 * @param html
	 * @param callback
	 * @returns none
	 */
	public send(mailAddress: string, bccAddress: string, title: string, text: string, html: string, callback: (error: IErrorObject) => void): void {

		const data: IMailSender = {
			from: this.account,
			to: mailAddress,
			bcc: bccAddress,
			subject: title,
			text: text,
			html: html,
		};

		this.mailgun.messages().send(data, (error: IErrorObject, body: any): void => {
			callback(error);
		});
	}
}

module.exports = MailSenderMailgun;
