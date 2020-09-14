/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {InfoDialogComponent} from "../base/components/info-dialog/info-dialog.component";
import {SessionableComponent} from "../base/components/sessionable.component";
import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";

import {AuthService} from "../auth/auth.service";
import {SessionService} from "../base/services/session.service";
import {AccountsService} from "./accounts.service";

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
		return this.progress;
	}

	public results: any[] = [];

	public progress: boolean = false;

	public nickname: string = "";
	public size: number = 20;
	public count: number = 0;

	public breakpoint: number = 4;

	protected query: object = {};
	protected page: number = 0;

	/**
	 *
	 * @param session
	 * @param authService
	 * @param accountService
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		private authService: AuthService,
		private accountService: AccountsService,
		private matDialog: MatDialog,
		private snackbar: MatSnackBar,
	) {
		super(session);
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
	 * エラー表示
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 8000
			});
		}
	}

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
		let result: number = 4;
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

		this.breakpoint =  this.widthToColumns(window.innerWidth);

		this.results = [];
		this.getSession((error: IErrorObject, session: object): void => {
			this.draw((error: IErrorObject, accounts: object[] | null): void => {
				if (!error) {
					if (accounts) {
						this.results = accounts;
					} else {
						this.errorBar({code: -1, message:"error."});
					}
				} else {
					this.errorBar(error);
				}
			});
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
					this.errorBar({code: -1, message:"error."});
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
					this.errorBar({code: -1, message:"error."});
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
			width: "40%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				session: this.currentSession,
				content: {
					title: "Regist",
					username: "",
					password: "",
					nickname: "",
				},
				service: this.accountService,
			},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: {content: {username: string, password: string, nickname: string}}): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				const content: {username: string, password: string, nickname: string} = result.content;
				const username: string = content.username;
				const password: string = content.password;
				const metadata: {nickname: string, id: string} = {nickname: content.nickname, id: "1"};
				this.authService.regist_immediate(username, password, metadata, (error: IErrorObject, result: object): void => {
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
		this.get(id, (error: IErrorObject, result: object | null): void => {
			if (!error) {
				if (result) {
					const dialog: MatDialogRef<any> = this.matDialog.open(AccountDialogComponent, {
						width: "30%",
						minWidth: "320px",
						height: "fit-content",
						data: {
							session: this.currentSession,
							user: result,
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
													this.Complete("error", {code: -1, message:"error."});
													this.errorBar({code: -1, message:"error."});
												}
											} else {
												this.Complete("error", error);
												this.errorBar(error);
											}
										});
									} else {
										this.Complete("error", {code: -1, message:"error."});
										this.errorBar({code: -1, message:"error."});
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
					this.Complete("error", {code: -1, message:"error."});
					this.errorBar({code: -1, message:"error."});
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
		const resultDialogContent: any = {title: "User", message: "Delete User?.", has_cancel: true};

		const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
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
									this.Complete("error", {code: -1, message: "error."});
									this.errorBar({code: -1, message: "error."});
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
