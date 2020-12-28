/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {IMailReceiverModule} from "../../../../types/platform/server";

const inbox = require("inbox");

const simpleParser = require('mailparser').simpleParser;

export class MailReceiver implements IMailReceiverModule {

	private type: string;
	private server: string;
	private user: string;
	private password: string;

	/**
	 *
	 */
	constructor(setting: any) {
		this.type = setting.type;
		this.server = setting.setting.server;
		this.user = setting.account;
		this.password = setting.password;
	}

	/**
	 *
	 */
	public addFlags(imap: any,UID: string, flags: string[], callback: Callback<any>) {
		try {
			if (imap) {
				imap.addFlags(UID, flags, (error: any, flags: any) => {
					callback(error, flags);
				});
			} else {
				callback({code: 1, message: "not imap"}, null);
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 *
	 */
	public removeFlags(imap: any,UID: string, flags: string[], callback: Callback<any>) {
		try {
			if (imap) {
				imap.removeFlags(UID, flags, (error: any, flags: any) => {
					callback(error, flags);
				});
			} else {
				callback({code: 1, message: "not imap"}, null);
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 *
	 */
	public listMessages(imap: any, start: number, limit: number, callback: Callback<any>) {
		try {
			if (imap) {
				imap.listMessages(start, limit, (error: any, messages: any) => {
					callback(error, messages);
				});
			} else {
				callback({code: 1, message: "not imap"}, null);
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 *
	 */
	public getMessage(imap: any, UID: string, callback: Callback<any>): void {
		try {
			if (imap) {
				const stream = imap.createMessageStream(UID);
				simpleParser(stream, (error:IErrorObject, mail: any) => {
					if (!error) {
						callback(null, mail);
					} else {
						callback(error, null);
					}
				});

			// 	simpleParser(stream)
			// 		.then((mail: any) => {
			// 			callback(null, mail);
			// 		})
			// 		.catch((error: IErrorObject) => {
			// 			callback(error, null);
			// 		});
			} else {
				callback({code: 1, message: "not imap"}, null);
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 *
	 */
	public deleteMessage(imap: any, uid: string, callback:(error: IErrorObject) => void): void {
		try {
			if (imap) {
				imap.deleteMessage(uid, callback)
			} else {
				callback({code: 1, message: "not imap"});
			}
		} catch (error) {
			callback(error);
		}
	}


	/**
	 * @param handler
	 */
	public connect(handler: (error: any, imap: any, type: string, message: any) => void): void {
		try {
			if (this.type === "imap") {
				const imap = inbox.createConnection(false, this.server, {
					secureConnection: true,
					auth: {
						user: this.user,
						pass: this.password
					}
				})

				imap.on("connect", () => {
					handler(null, imap,"connect", null);
				})

				imap.on("new", (message: any) => {
					handler(null, imap, "new", message);
				});

				imap.on('close', () => {
					handler(null, imap,"close", null);
				})

				imap.connect()

			} else {
				handler({code: 1, message: "not imap"}, null,"", null);
			}
		} catch (error) {
			handler(error, null,"", null);
		}

	}

	/**
	 * @param imap
	 * @param name
	 * @param callback
	 */
	public open(imap: any, name: string, callback: Callback<any>): void {
		try {
			if (imap) {
				imap.openMailbox(name, (error: any, info: any) => {
					if (!error) {
						callback(null, info);
					} else {
						callback(error, null);
					}
				})
			} else {
				callback({code: 1, message: "not imap"}, null);
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 *
	 */
	public close(imap: any): void {
		try {
			if (imap) {
				imap.close()
			}
		} catch (error) {
		}
	}

}


module.exports = MailReceiver;













