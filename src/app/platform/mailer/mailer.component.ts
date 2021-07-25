/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {SessionableComponent} from "../base/components/sessionable.component";

import {AuthService} from "../auth/auth.service";
import {SessionService} from "../base/services/session.service";
import {MailerService} from "./mailer.service";
import {ReplyDialogComponent} from "./reply-dialog/reply-dialog.component";
import {Overlay} from "@angular/cdk/overlay";
import {SendDialogComponent} from "./send-dialog/send-dialog.component";
import {YesNoDialogComponent} from "../base/components/yes-no-dialog/yes-no-dialog.component";
import {Spinner} from "../base/library/spinner";
import {Errors} from "../base/library/errors";
import {ActivatedRoute, Router} from "@angular/router";

// const moment = require('moment');
// require('moment-timezone');

/**
 * メーラー
 *
 * @since 0.01
 */
@Component({
	selector: "mailer",
	templateUrl: "./mailer.component.html",
	styleUrls: ["./mailer.component.css"],
})
export class MailerComponent extends SessionableComponent implements OnInit {

	public get isProgress(): boolean {
		return this.spinner.progress;
	}

	public size: number = 20;
	public count: number = 0;

	public results: any[] = [];

	public params: any = {};

	protected page: number = 0;

	private option: { start: number, limit: number } = {start: 0, limit: 0};

	private mailbox: string = "INBOX";

	private spinner: Spinner;

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param authService
	 * @param mailerService
	 * @param matDialog
	 * @param snackbar
	 * @param router
	 * @param route
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		private authService: AuthService,
		private mailerService: MailerService,
		private matDialog: MatDialog,
		private snackbar: MatSnackBar,
		private router: Router,
		protected route: ActivatedRoute,
	) {
		super(session);
		this.spinner = new Spinner(overlay);
	}

	/**
	 */
	private Progress(value: boolean): void {
		this.spinner.Progress(value);
	}

	/**
	 */
	private setPage(page: number): void {
		this.page = page;
		this.count = 100;//  -(this.page * this.size);
		this.option = {start: -(this.page * this.size), limit: this.size};
	}

	/**
	 * メール参照
	 * @param UID
	 * @param callback
	 */
	private get(UID: string, callback: Callback<object>): void {
		this.mailerService.get(this.mailbox, UID, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 *
	 * @param data
	 * @param callback
	 */
	private send(data: object, callback: Callback<object>): void {
		this.mailerService.send(data, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * @param UID
	 * @param flags
	 * @param callback
	 */
	private addFlags(UID: string, flags: string[], callback: Callback<object>): void {
		this.mailerService.addFlags(this.mailbox, UID, flags, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * @param UID
	 * @param flags
	 * @param callback
	 */
	private removeFlags(UID: string, flags: string[], callback: Callback<object>): void {
		this.mailerService.removeflags(this.mailbox, UID, flags, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * アカウント削除
	 * @param UID
	 * @param callback
	 */
	private delete(UID: string, callback: Callback<any>): void {
		this.mailerService.delete(this.mailbox, UID, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * エラー表示
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			if (error.code === 1) {
				this.router.navigate(['/']);
			} else {
				this.snackbar.open(error.message, "Close", {
					duration: 8000,
				});
			}
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
// 		duration: 8000,
				panelClass: ["message-snackbar"]
			});
		}
	}

	/**
	 * 再描画
	 * @param callback
	 */
	private draw(callback: Callback<object[]>): void {
		this.mailerService.query(this.mailbox, this.option, (error: IErrorObject, result: { value: { info: any, messages: any[] } }): void => {
			if (!error) {
				this.count = result.value.info.count;
				const messages: object[] = result.value.messages.map((message) => {
					return this.toListView(message);
				});
				callback(null, messages.reverse());
			} else {
				callback(error, null);
				this.Complete("error", error);
			}
		});
	}


	/**
	 * リストビューデコレータ
	 * @param object
	 */
	protected toListView(object: any): any {
		return object;
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.Progress(true);
		this.setPage(1);
		this.results = [];
		this.getSession((error: IErrorObject, session: object): void => {
			if (!error) {
				this.route.queryParams.subscribe(params => {
					this.params = params;
					this.draw((error: IErrorObject, messages: object[] | null): void => {
						this.Progress(false);
						if (!error) {
							if (messages) {
								this.results = messages;
							} else {
								this.errorBar(Errors.generalError(-1, "error.", "A00229"));
							}
						} else {
							this.errorBar(error);
						}
					});
				});
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 *
	 */
	public isSeenStyle(object: any): any {
		let result: any = {"font-weight": "900"};  // not Seen
		if (object.flags.filter((item: string) => {
			return item === '\\Seen'
		}).length > 0) {
			result = {"font-weight": "200"};   // Seen
		}
		return result;
	}

	/**
	 */
	public messageDate(object: any): string {
		return object.date.toDateString();
		// 	return moment(object.date).format("YY-MM-DD hh:mm");
	}

	/**
	 *
	 */
	public onResize(event: any): void {

	}

	/**
	 */
	public onSend(): void {
		this.Progress(true);
		const dialog: MatDialogRef<any> = this.matDialog.open(SendDialogComponent, {
			width: "70%",
			minWidth: "320px",
			height: "fit-content",
			data: {to: "oda.mikio+test@gmail.com", title: "", description: ""},
			disableClose: true,
		});

		dialog.afterOpened().subscribe((result: any): void => {
			this.Progress(false);
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				const data: any = {
					from: "oda.mikio@gmail.com",
					to: result.to,
					bcc: "",
					subject: result.title,
					text: result.description,
				};

				this.send(data, () => {
					this.draw((error: IErrorObject, messages: object[] | null): void => {
						this.Progress(false);
						if (!error) {
							if (messages) {
								this.results = messages;
							} else {
								this.errorBar(Errors.generalError(-1, "error.", "A00230"));
							}
						} else {
							this.errorBar(error);
						}
					});
				})
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});

	}

	/**
	 */
	public onReply(message: any): void {
		this.Progress(true);
		this.get(message.UID, (error: IErrorObject, from_message: any) => {
			if (!error) {

				let text: string = from_message.text;
				if (from_message.textAsHtml) {
					text = from_message.textAsHtml;
				}
				const html: string = from_message.html;

				const dialog: MatDialogRef<any> = this.matDialog.open(ReplyDialogComponent, {
					width: "70%",
					minWidth: "320px",
					height: "fit-content",
					data: {reply: message.from.address, subject: message.title, text: text, html: html, title: "", description: ""},
					disableClose: true,
				});

				dialog.afterOpened().subscribe((result: any): void => {
					this.Progress(false);
				});

				dialog.beforeClosed().subscribe((result: any): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						const data: any = {
							from: "oda.mikio@gmail.com",
							to: "oda.mikio@gmail.com",
							bcc: "",
							subject: result.title,
							text: result.description,
						};

						this.addFlags(message.UID, ["\\Seen"], (error, flugs) => {
							if (error) {
								this.errorBar(error);
							}
						});

						this.send(data, () => {
							this.draw((error: IErrorObject, messages: object[] | null): void => {
								this.Progress(false);
								if (!error) {
									if (messages) {
										this.results = messages;
									} else {
										this.errorBar(Errors.generalError(-1, "error.", "A00231"));
									}
								} else {
									this.errorBar(error);
								}
							});
						})
					}
				});

				dialog.afterClosed().subscribe((result: any): void => {
					this.Complete("", result);
				});

			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public onDelete(message: any): void {
		this.Progress(true);
		const resultDialogContent: any = {title: "Mail", message: "Delete this?"};
		const dialog: MatDialogRef<any> = this.matDialog.open(YesNoDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				session: this.currentSession,
				content: resultDialogContent,
			},
			disableClose: true,
		});

		dialog.afterOpened().subscribe((result: any): void => {
			this.Progress(false);
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				this.delete(message.UID, (error: any, messages: any[]) => {
					this.draw((error: IErrorObject, messages: object[] | null): void => {
						this.Progress(false);
						if (!error) {
							if (messages) {
								this.results = messages;
							} else {
								this.errorBar(Errors.generalError(-1, "error.", "A00232"));
							}
						} else {
							this.errorBar(error);
						}
					});
				})
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});

	}

	/**
	 * ページ送り
	 * @param event
	 * @constructor
	 */
	public onPage(event: any): void {
		this.Progress(true);
		this.setPage(event.pageIndex + 1);
		this.draw((error: IErrorObject, messages: object[] | null): void => {
			this.Progress(false);
			if (!error) {
				if (messages) {
					this.results = messages;
				} else {
					this.errorBar(Errors.generalError(-1, "error.", "A00233"));
				}
			} else {
				this.errorBar(error);
			}
		});
	}

}
