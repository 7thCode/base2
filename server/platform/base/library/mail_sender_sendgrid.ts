/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IMailSenderModule} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";

export class MailSenderSendgrid implements IMailSenderModule {

	private account: any;
	private apiKey: string;
	private domain: any;
	private sendgrid: any;

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
		this.sendgrid = require('@sendgrid/mail');
		this.sendgrid.setApiKey(this.apiKey);
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

		const data = {
			from: this.account,
			to: mailAddress,
			bcc: bccAddress,
			subject: title,
			text: text,
			html: html,
		};
		this.sendgrid.send(data).then(() => {
			callback(null);
		}).catch((error: any) => {
			callback(error);
		});

		// const data: IMailSender = {
		// 	from: this.account,
		// 	to: mailAddress,
		// 	bcc: bccAddress,
		// 	subject: title,
		// 	html: message,
		// };
//
		// this.mailgun.messages().send(data, (error: IErrorObject, body: any): void => {
		// 	callback(error);
		// });
	}
}

module.exports = MailSenderSendgrid;
