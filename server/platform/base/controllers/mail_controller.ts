/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {IMailReceiverModule, IMailSenderModule} from "../../../../types/platform/server";
import {Errors} from "../library/errors";

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

	private readonly sender: IMailSenderModule = null;
	private readonly receiver: IMailReceiverModule = null;

// 	private bcc: string | any[] = "";

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
				this.bcc = senderSetting.bcc;
				break;
			case "gmail":
				this.sender = new GMail(senderSetting.setting, senderSetting.account);
				this.bcc = senderSetting.bcc;
				break;
			case "mailgun":
				this.sender = new MailGun(senderSetting.setting, senderSetting.account);
				this.bcc = senderSetting.bcc;
				break;
			case "sendgrid":
				this.sender = new SendGrid(senderSetting.setting, senderSetting.account);
				this.bcc = senderSetting.bcc;
				break;
			default:
				this.sender = new GMail(senderSetting.setting, senderSetting.account);
				this.bcc = senderSetting.bcc;
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
	private parseHTMLContent(mailConfig: any, callback: (error: IErrorObject, text: string, html: string) => void): void {
		try {
			if (mailConfig) {
				if (mailConfig.source_object) {
					if (mailConfig.template_url) {
						if (mailConfig.source_object.html) {
							const nickname = mailConfig.source_object.html.content.nickname;
							// mailConfig.source_object.html.content.subtitle = this.parseTemplate(mailConfig.source_object.html.content.subtitle, {nickname: nickname});
							fs.readFile(path.join(project_root, mailConfig.template_url), "utf8", (error: IErrorObject, data: any): void => {
								if (!error) {
									try {
										// 		const html: string = pug.render(data, {content: mailConfig.source_object.html, link: mailConfig.link});
										const html: string = pug.render(data, {content: mailConfig.source_object.html, link: mailConfig.link, nickname: nickname});
										let text: string = "";
										const text_lines = mailConfig.source_object.text.content.text;
										const value = {link: mailConfig.link};
										if (text_lines) {
											text_lines.forEach((line: string) => {
												text += this.parseTemplate(line, value) + "\n";
											})
											callback(null, text, html);
										} else {
											callback(Errors.configError(1, "config error.", "S00007"), "", "");
										}
									} catch (error) {
										callback(error, "", "");
									}
								} else {
									callback(error, "", "");
								}
							});
						} else {
							callback(null, "", "");
						}
					}
				} else {
					callback(Errors.configError(1, "config error.", "S00011"), "", "");
				}
			} else {
				callback(Errors.configError(1, "config error.", "S00012"), "", "");
			}
		} catch (error) {
			callback(error, "", "");
		}
	}

	/**
	 *
	 * parse content
	 *
	 * @param mailConfig
	 * @param callback
	 * @returns none
	 */
	private parseTEXTContent(mailConfig: any, callback: (error: IErrorObject, text: string, html: string) => void): void {
		try {
			if (mailConfig) {
				if (mailConfig.source_object) {
					if (mailConfig.template_url) {
						if (mailConfig.source_object.text) {
							let text: string = "";
							const text_lines: string[] = mailConfig.source_object.text.content.text;
							if (text_lines) {
								text_lines.forEach((line: string) => {
									text += line + "\n";
								})
								callback(null, text, text);
							} else {
								callback(Errors.configError(1, "config error.", "S00009"), "", "");
							}
						} else {
							callback(null, "", "");
						}
					}
				} else {
					callback(Errors.configError(1, "config error.", "S00011"), "", "");
				}
			} else {
				callback(Errors.configError(1, "config error.", "S00012"), "", "");
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
			this.parseHTMLContent(mailConfig, (error: IErrorObject, text: string, html: string): void => {
				if (!error) {
					this.parseTEXTContent(mailConfig, (error: IErrorObject, text: string, html: string): void => {
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
					callback(error, null);
				}
			});
		} else {
			callback(Errors.configError(1, "config error.", "S00013"), null);
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
			handler(Errors.configError(1, "config error.", "S00014"), "", null);
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
				callback(Errors.configError(1, "config error.", "S00015"), null);
			}
		} else {
			callback(Errors.generalError(1, "not opened.", "S00016"), null);
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
				callback(Errors.configError(1, "config error.", "S00017"), null);
			}
		} else {
			callback(Errors.generalError(1, "not opened.", "S00018"), null);
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
				callback(Errors.configError(1, "config error.", "S00019"), null);
			}
		} else {
			callback(Errors.generalError(1, "not opened.", "S00020"), null);
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
				callback(Errors.configError(1, "config error.", "S00021"));
			}
		} else {
			callback(Errors.generalError(1, "not opened.", "S00022"));
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
				callback(Errors.configError(1, "config error.", "S00023"));
			}
		} else {
			callback(Errors.generalError(1, "not opened.", "S00024"));
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
				callback(Errors.configError(1, "config error.", "S00025"));
			}
		} else {
			callback(Errors.generalError(1, "not opened.", "S00026"));
		}
	}

}

module.exports = Mail;
