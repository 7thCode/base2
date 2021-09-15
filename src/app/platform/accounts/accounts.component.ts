/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {ActivatedRoute, Router} from '@angular/router';
import {AuthLevel, Callback, IErrorObject} from "../../../../types/platform/universe";

import {Component, OnInit} from "@angular/core";

import {Overlay} from "@angular/cdk/overlay";

import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {Spinner} from "../base/library/spinner";

import {SessionableComponent} from "../base/components/sessionable.component";
import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";
import {YesNoDialogComponent} from "../base/components/yes-no-dialog/yes-no-dialog.component";

import {AuthService} from "../auth/auth.service";
import {SessionService} from "../base/services/session.service";
import {AccountsService} from "./accounts.service";
import {Errors} from "../base/library/errors";

/**
 * アカウントレコード
 *
 * @since 0.01
 */
@Component({
	selector: "accounts",
	templateUrl: "./accounts.component.html",
	styleUrls: ["./accounts.component.css"],
})

export class AccountsComponent extends SessionableComponent implements OnInit {

	public get isProgress(): boolean {
		return this.spinner.progress;
	}

	public params: any = {};

	public results: any[] = [];

	public nickname: string = "";
	public size: number = 20;
	public count: number = 0;

	public breakpoint: number = 4;

	protected query: object = {};
	protected page: number = 0;

	private spinner: Spinner;

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param authService
	 * @param accountService
	 * @param matDialog
	 * @param snackbar
	 * @param router
	 * @param route
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		private authService: AuthService,
		private accountService: AccountsService,
		private matDialog: MatDialog,
		private snackbar: MatSnackBar,
		private router: Router,
		protected route: ActivatedRoute,
	) {
		super(session);
		this.spinner = new Spinner(overlay);
	}

	/**
	 * フォームコンバータ
	 * @param data
	 */
	public static confirmToForm(data: object): object {
		return data;
	}

	/**
	 * モデルコンバータ
	 * @param data
	 */
	public static confirmToModel(data: object): object {
		return data;
	}

	private Progress(value: boolean): void {
		this.spinner.Progress(value);
	}

	/**
	 * アカウント参照
	 * @param id
	 * @param callback
	 */
	private get(id: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * アカウント更新
	 * @param id
	 * @param data
	 * @param callback
	 */
	private update(id: string, data: object, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.put(id, data, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * アカウント削除
	 * @param id
	 * @param callback
	 */
	private delete(id: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.delete(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}


	/**
	 * リレーション
	 * @param to
	 * @param type
	 * @param callback
	 */
	private make_relation(to: string, type: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.make_relation(to, type, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * リレーション削除
	 * @param to
	 * @param type
	 * @param callback
	 */
	private break_relation(to: string, type: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.break_relation(to, type, (error: IErrorObject, result: object): void => {
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
	// private messageBar(message: string): void {
	// 	if (message) {
	// 		this.snackbar.open(message, "Close", {
	// 			duration: 8000,
	// 			panelClass: ["message-snackbar"]
	// 		});
	// 	}
	// }

	/**
	 * リストビューデコレータ
	 * @param object
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

	/*
	* width to grid columns
	* override
	* @returns columns
 	*/
	protected widthToColumns(width: number): number {
		let result: number;
		if (width < 600) {
			result = 1;  // xs,
		} else if (width < 960) {
			result = 2;  // sm,
		} else if (width < 1280) {
			result = 4;  // md,
		} else if (width < 1920) {
			result = 6; // lg,
		} else {
			result = 8; // xl,
		}
		return result;
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.Progress(false);
		this.page = 0;
		this.query = {};

		this.breakpoint = this.widthToColumns(window.innerWidth);

		this.results = [];
		this.getSession((error: IErrorObject, session: object): void => {
			if (!error) {
				this.route.queryParams.subscribe(params => {
					this.params = params;
					this.draw((error: IErrorObject, accounts: object[] | null): void => {
						if (!error) {
							if (accounts) {
								this.results = accounts;
							} else {
								this.errorBar(Errors.generalError(-1, "error.", "A00002"));
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
	public onResize(event: any): void {
		this.breakpoint = this.widthToColumns(event.target.innerWidth);
	}

	/**
	 *
	 */
	public findByNickname(): void {
		this.query = {};
		this.page = 0;
		if (this.nickname) {
			this.query = {"content.nickname": {$regex: this.nickname}};
		}
		this.draw((error: IErrorObject, accounts: object[] | null): void => {
			if (!error) {
				if (accounts) {
					this.results = accounts;
				} else {
					this.errorBar(Errors.generalError(-1, "error.", "A00003"));
				}
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * 再描画
	 * @param callback
	 */
	public draw(callback: Callback<object[]>): void {
		this.Progress(true);
		this.accountService.count(this.query, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.count = result.value;
				const option = {sort: {auth: 1}, skip: this.size * this.page, limit: this.size};
				this.accountService.query(this.query, option, (error: IErrorObject, results: any[]): void => {
					if (!error) {
						const accounts: object[] = results.map((result) => {
							return this.toListView(result);
						});
						// this.results = accounts;
						callback(null, accounts);
					} else {
						callback(error, null);
						this.Complete("error", error);
					}
					this.Progress(false);
				});
			} else {
				callback(error, null);
				this.Complete("error", error);
			}
		});
	}

	/**
	 * ページ送り
	 * @param event
	 * @constructor
	 */
	public Page(event: any): void {
		this.page = event.pageIndex;
		this.draw((error: IErrorObject, accounts: object[] | null): void => {
			if (!error) {
				if (accounts) {
					this.results = accounts;
				} else {
					this.errorBar(Errors.generalError(-1, "error.", "A00004"));
				}
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * クリエイトダイアログ
	 */
	public createDialog(): void {
		const dialog: MatDialogRef<any> = this.matDialog.open(RegistDialogComponent, {
			width: "80%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				session: this.currentSession,
				content: {
					title: "Regist",
					description: "Lorem ipsum...",
					username: "",
					password: "",
					nickname: "",
				},
				service: this.accountService,
			},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: { content: { username: string, password: string, nickname: string } }): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				const content: { username: string, password: string, nickname: string } = result.content;
				const username: string = content.username;
				const password: string = content.password;
				const category: string = "";
				const type: string = "";
				const auth:number = AuthLevel.user;

				const metadata: { nickname: string, id: string } = {nickname: content.nickname, id: "1"};
				this.authService.regist_immediate(auth, username, password, category, type, metadata, (error: IErrorObject, result: object): void => {
					if (!error) {
						this.draw((error: IErrorObject, accounts: object[]): void => {
							if (!error) {
								this.results = accounts;
								this.Complete("", result);
							} else {
								this.Complete("error", error);
								this.errorBar(error);
							}
						});
					} else {
						this.Complete("error", error);
						this.errorBar(error);
					}
					this.Progress(false);
				});
			}
		});

		dialog.afterClosed().subscribe((result: object): void => {

		});
	}

	/**
	 * アップデートダイアログ
	 * @returns none
	 */
	public updateDialog(id: string): void {
		this.Progress(true);
		this.get(id, (error: IErrorObject, result: any | null): void => {
			if (!error) {
				if (result) {
					const dialog: MatDialogRef<any> = this.matDialog.open(AccountDialogComponent, {
						minWidth: "320px",
						height: "fit-content",
						data: {
							session: this.currentSession,
							type: result.type,
							content: AccountsComponent.confirmToForm(result),
							service: this.accountService,
						},
						disableClose: true,
					});

					dialog.beforeClosed().subscribe((result: object): void => {
						if (result) { // if not cancel then
							this.Progress(true);
							this.update(id, AccountsComponent.confirmToModel(result), (error: IErrorObject, result: object | null): void => {
								if (!error) {
									if (result) {
										this.draw((error: IErrorObject, accounts: object[] | null): void => {
											if (!error) {
												if (accounts) {
													this.results = accounts;
													this.Complete("", result);
												} else {
													this.Complete("error", Errors.generalError(-1, "error.", "A00005"));
													this.errorBar(Errors.generalError(-1, "error.", "A00006"));
												}
											} else {
												this.Complete("error", error);
												this.errorBar(error);
											}
										});
									} else {
										this.Complete("error", Errors.generalError(-1, "error.", "A00007"));
										this.errorBar(Errors.generalError(-1, "error.", "A00008"));
									}
								} else {
									this.Complete("error", error);
									this.errorBar(error);
								}
								this.Progress(false);
							});
						}
					});

					dialog.afterClosed().subscribe((result: object): void => {

					});
				} else {
					this.Complete("error", Errors.generalError(-1, "error.", "A00009"));
					this.errorBar(Errors.generalError(-1, "error.", "A00010"));
				}
			} else {
				this.Complete("error", error);
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

	/**
	 * デリートダイアログ
	 * @returns none
	 */
	public deleteDialog(id: string): void {
		const resultDialogContent: any = {title: "User", message: "Delete User?"};

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

		dialog.afterClosed().subscribe((result: object) => {
			if (result) { // if not cancel then
				this.Progress(true);
				this.delete(id, (error: IErrorObject, result: any): void => {
					if (!error) {
						this.draw((error: IErrorObject, accounts: object[] | null): void => {
							if (!error) {
								if (accounts) {
									this.results = accounts;
									this.Complete("", result);
								} else {
									this.Complete("error", Errors.generalError(-1, "error.", "A00011"));
									this.errorBar(Errors.generalError(-1, "error.", "A00012"));
								}
							} else {
								this.Complete("error", error);
								this.errorBar(error);
							}
						});
					} else {
						this.Complete("error", error);
						this.errorBar(error);
					}
					this.Progress(false);
				});
			}
		});
	}

}
