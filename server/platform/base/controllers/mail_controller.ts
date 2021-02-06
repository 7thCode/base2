/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {IMailReceiverModule, IMailSenderModule} from "../../../../types/platform/server";

const fs: any = require("graceful-fs");
const pug: any = require("pug");

const path: any = require("path");

const project_root = path.join(__dirname, "../../../..");

const Wrapper: any = require("./wrapper");

const Receiver: any = require("../../../../server/platform/base/library/mail_receiver");

const Mailer: any = require("../../../../server/platform/base/library/mail_sender");
const GMail: any = require("../../../../server/platform/base/library/mail_gmail");
const MailGun: any = require("../../../../server/platform/base/library/mail_sender_mailgun");
const SendGrid: any = require("../../../../server/platform/base/library/mail_sender_sendgrid");

/**
 * Base class for classes that need to send email.
 */
export class Mail extends Wrapper {

	private sender: IMailSenderModule = null;
	private receiver: IMailReceiverModule = null;
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

		const senderSetting = this.systemsConfig.mailer.sender;
		const receiverSetting = this.systemsConfig.mailer.receiver;

		if (receiverSetting) {
			this.receiver = new Receiver(receiverSetting);
		}

		switch (senderSetting.type) {
			case "mail":
				this.sender = new Mailer(senderSetting.setting, senderSetting.account);
				this.bcc = "";
				break;
			case "gmail":
				this.sender = new GMail(senderSetting.setting, senderSetting.account);
				this.bcc = "";
				break;
			case "mailgun":
				this.sender = new MailGun(senderSetting.setting, senderSetting.account);
				this.bcc = [];
				break;
			case "sendgrid":
				this.sender = new SendGrid(senderSetting.setting, senderSetting.account);
				this.bcc = [];
				break;
			default:
				this.sender = new GMail(senderSetting.setting, senderSetting.account);
				this.bcc = "";
				break;
		}
	}

	/**
	 *
	 */
	private parseTemplate(string: string, values: any): string {
		return string.replace(/\$\{(.*?)\}/g, (all: string, key: string): string => {
			return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : "";
		});
	}

	/**
	 *
	 * parse content
	 *
	 * @param mailConfig
	 * @param callback
	 * @returns none
	 */
	private parseContent(mailConfig: any, callback: (error: IErrorObject, text: string, html: string) => void): void {
		try {
			if (mailConfig) {
				if (mailConfig.source_object) {
					if (mailConfig.template_url) {
						if (mailConfig.source_object.html) {
							const nickname = mailConfig.source_object.html.content.nickname;
							mailConfig.source_object.html.content.subtitle = this.parseTemplate(mailConfig.source_object.html.content.subtitle, {nickname: nickname});
							fs.readFile(path.join(project_root, mailConfig.template_url), "utf8", (error: IErrorObject, data: any): void => {
								if (!error) {
									const html: string = pug.render(data, {content: mailConfig.source_object.html, link: mailConfig.link});

									let text: string = "";
									const text_lines = mailConfig.source_object.text.content.text;
									const value = {link: mailConfig.link};
									if (text_lines) {
										text_lines.forEach((line: string) => {
											text += this.parseTemplate(line, value) + "\n";
										})
										callback(null, text, html);
									} else {
										callback({code: 1, message: "error"}, "", "");
									}
								} else {
									callback(error, "", "");
								}
							});
						} else {
							callback({code: 1, message: "no html object."}, "", "");
						}
					} else {
						if (mailConfig.source_object.text) {
							let text: string = "";
							const text_lines: string[] = mailConfig.source_object.text.content.text;
							if (text_lines) {
								text_lines.forEach((line: string) => {
									text += line + "\n";
								})
								callback(null, text, text);
							} else {
								callback({code: 1, message: "error"}, "", "");
							}
						} else {
							callback({code: 1, message: "no text object."}, "", "");
						}
					}
				} else {
					callback({code: 1, message: "no source_object"}, "", "");
				}
			} else {
				callback({code: 1, message: "no content"}, "", "");
			}
		} catch (error) {
			callback(error, "", "");
		}
	}

	/**
	 *
	 * send mail
	 *
	 * @param mailConfig
	 * @param callback
	 * @returns none
	 */
	protected sendMail(mailConfig: any, callback: Callback<any>): void {
		if (this.sender) {
			this.parseContent(mailConfig, (error: IErrorObject, text: string, html: string): void => {
				if (!error) {
					this.sender.send(mailConfig.address, mailConfig.bcc, mailConfig.title, text, html, (error: IErrorObject): void => {
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
		} else {
			callback({code: 1, message: "no sender"}, null);
		}
	}


	/**
	 *
	 * get message
	 *
	 * @param handler
	 * @returns none
	 */
	protected connect(handler: (error: IErrorObject, type: string, message: any) => void): void {
		if (this.receiver) {
			this.receiver.connect(handler);
		} else {
			handler({code: 1, message: "no receiver"}, "", null);
		}
	}

	/**
	 *
	 * get message
	 *
	 * @param name
	 * @param callback
	 * @returns none
	 */
	protected open(imap: any, name: string, callback: Callback<any>): void {
		if (imap) {
			if (this.receiver) {
				this.receiver.open(imap, name, callback);
			} else {
				callback({code: 1, message: "no receiver"}, null);
			}
		} else {
			callback({code: 1, message: "not opened."}, null);
		}
	}

	/**
	 *
	 * get message
	 *
	 * @returns none
	 */
	protected close(imap: any): void {
		if (imap) {
			if (this.receiver) {
				this.receiver.close(imap);
			}
		}
	}

	/**
	 *
	 * list messages
	 *
	 * @param imap
	 * @param start
	 * @param limit
	 * @param callback
	 * @returns none
	 */
	protected listMessages(imap: any, start: number, limit: number, callback: Callback<any>) {
		if (imap) {
			if (this.receiver) {
				this.receiver.listMessages(imap, start, limit, callback);
			} else {
				callback({code: 1, message: "no receiver"}, null);
			}
		} else {
			callback({code: 1, message: "not opened."}, null);
		}
	}

	/**
	 *
	 * get message
	 *
	 * @param imap
	 * @param UID
	 * @param callback
	 * @returns none
	 */
	protected getMessage(imap: any, UID: string, callback: Callback<any>): void {
		if (imap) {
			if (this.receiver) {
				this.receiver.getMessage(imap, UID, callback);
			} else {
				callback({code: 1, message: "no receiver"}, null);
			}
		} else {
			callback({code: 1, message: "not opened."}, null);
		}
	}

	/**
	 *
	 * delete message
	 *
	 * @param imap
	 * @param UID
	 * @param callback
	 * @returns none
	 */
	protected deleteMessage(imap: any, UID: string, callback: (error: IErrorObject) => void): void {
		if (imap) {
			if (this.receiver) {
				this.receiver.deleteMessage(imap, UID, callback);
			} else {
				callback({code: 1, message: "no receiver"});
			}
		} else {
			callback({code: 1, message: "not opened."});
		}
	}

	/**
	 *
	 * delete message
	 *
	 * @param imap
	 * @param UID
	 * @param flags
	 * @param callback
	 * @returns none
	 */
	protected addFlags(imap: any, UID: string, flags: string[], callback: (error: IErrorObject) => void): void {
		if (imap) {
			if (this.receiver) {
				this.receiver.addFlags(imap, UID, flags, callback);
			} else {
				callback({code: 1, message: "no receiver"});
			}
		} else {
			callback({code: 1, message: "not opened."});
		}
	}

	/**
	 *
	 * delete message
	 *
	 * @param imap
	 * @param UID
	 * @param flags
	 * @param callback
	 * @returns none
	 */
	protected removeFlags(imap: any, UID: string, flags: string[], callback: (error: IErrorObject) => void): void {
		if (imap) {
			if (this.receiver) {
				this.receiver.removeFlags(imap, UID, flags, callback);
			} else {
				callback({code: 1, message: "no receiver"});
			}
		} else {
			callback({code: 1, message: "not opened."});
		}
	}

}

module.exports = Mail;
