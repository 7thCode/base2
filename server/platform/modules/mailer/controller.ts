/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

import {IAccountModel} from "../../../../types/platform/server";
import {Errors} from "../../base/library/errors";

const Mail: any = require("../../../../server/platform/base/controllers/mail_controller");

/*
*
*
*
*/
export class Mailer extends Mail {

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
	}

	/**
	 * openMailbox
	 *
	 * @param request
	 * @param response
	 * @param callback
	 * @return none
	 */
	private openMailbox(request: any, response: any, callback: (error: IErrorObject, imap: any, option: any) => void): void {
		if (request.user) {
			const params: any = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.ifExist(response, Errors.userError(1, "not loged in.", "S00365"), operator.login, (): void => {
				this.connect((error: any, imap: any, type: string, message: any): void => {
					this.ifSuccess(response, error, (): void => {
						switch (type) {
							case "connect":
								this.open(imap, params.name, (error: IErrorObject, message: any): void => {
									this.ifSuccess(response, error, (): void => {
										callback(error, imap, message);
										this.close();
									});
								});
								break;
							default:
						}
					});
				});
			});
		} else {
			this.SendError(response, Errors.userError(1, "not logged in.", "S00366"));
		}
	}

	/**
	 *
	 * query message.
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public query(request: any, response: any): void {
		try {
			this.openMailbox(request, response, (error: IErrorObject, imap: any, info: any): void => {
				this.ifSuccess(response, error, (): void => {
					this.Decode(request.params.option, (error: IErrorObject, option: { start: number, limit: number }): void => {
						this.listMessages(imap, option.start, option.limit, (error: IErrorObject, messages: any): void => {
							this.ifSuccess(response, error, (): void => {
								this.SendSuccess(response, {info: info, messages: messages});
							});
						})
					});
				})
			})
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00367"));
		}
	}

	/**
	 *
	 * Message Get
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get(request: any, response: any): void {
		try {
			this.openMailbox(request, response, (error: IErrorObject, imap: any, option: any): void => {
				this.ifSuccess(response, error, (): void => {
					this.getMessage(imap, request.params.UID, (error: IErrorObject, mail: any): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, mail);
						});
					})
				});
			})
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00368"));
		}
	}

	/**
	 *
	 * SEND Message
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public send(request: any, response: any): void {
		try {
			const target: any = request.body;
			const source_object: any = {
				content: {
					text: [
						target.text
					]
				}
			};

			const content = {
				address: target.from,
				bcc: target.bcc,
				title: target.subject,
				source_object: {text: source_object},
			};

			this.sendMail(content, (error: IErrorObject, result: any): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, {})
				});
			})
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00369"));
		}
	}

	/**
	 *
	 * messagew delete.
	 *
	 * Message Delete
	 * @param request
	 * @param response
	 * @returns none
	 */
	public delete(request: any, response: any): void {
		try {
			this.openMailbox(request, response, (error: IErrorObject, imap, option: any): void => {
				this.ifSuccess(response, error, (): void => {
					this.deleteMessage(imap, request.params.UID, (error: IErrorObject): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, {});
						});
					});
				});
			})
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00370"));
		}
	}

	/**
	 *
	 * set flag
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public addFlags(request: any, response: any): void {
		try {
			this.openMailbox(request, response, (error: IErrorObject, imap, option: any): void => {
				this.ifSuccess(response, error, (): void => {
					const flags = request.body.flags;
					super.addFlags(imap, request.params.UID, flags, (error: IErrorObject): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, {});
						});
					});
				});
			})
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00371"));
		}
	}

	/**
	 *
	 * remove flag
	 *
	 * Message Delete
	 * @param request
	 * @param response
	 * @returns none
	 */
	public removeFlags(request: any, response: any): void {
		try {
			this.openMailbox(request, response, (error: IErrorObject, imap, option: any): void => {
				this.ifSuccess(response, error, (): void => {
					const flags = request.body.flags;
					super.removeFlags(imap, request.params.UID, flags, (error: IErrorObject): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, {});
						});
					});
				});
			})
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00372"));
		}
	}

}

module.exports = Mailer;
