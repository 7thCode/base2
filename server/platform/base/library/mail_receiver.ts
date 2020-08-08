/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

export class MailReceiver {

	private inbox: any;
	private conv: any;

	/**
	 *
	 */
	constructor() {
		const iconv = require("iconv");
		this.conv = new iconv.Iconv("UTF-8", "UTF-8");
		this.inbox = require("inbox");
	}

	/**
	 *
	 * @param receiverSetting
	 * @param connect
	 * @param receive
	 */
	public connect(receiverSetting: any, connect: (error: IErrorObject) => {}, receive: (message: any, body: any) => {}): void {

		let imap: any = null;

		if (receiverSetting.type === "imap") {
			imap = this.inbox.createConnection(
				false, receiverSetting.address, {
					secureConnection: true,
					auth: receiverSetting.auth,
				},
			);

			imap.on("connect", () => {
				imap.openMailbox("INBOX", (error: IErrorObject) => {
					connect(error);
				});
			});

			imap.on("new", (message: any) => {
				const stream = imap.createMessageStream(message.UID);
				const simpleParser = require("mailparser").simpleParser;
				simpleParser(stream).then((mail): void => {
					receive(message, mail);
				}).catch((error): void => {

				});
			});

			imap.connect();
		}
	}
}

module.exports = MailReceiver;
