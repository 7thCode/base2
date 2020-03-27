/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout"; // for responsive
import {MatDialog} from "@angular/material/dialog";
import {MatGridList} from "@angular/material/grid-list";
import {MatSnackBar} from "@angular/material/snack-bar";

import {InfoDialogComponent} from "../base/components/info-dialog/info-dialog.component";
import {SessionableComponent} from "../base/components/sessionable.component";
import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";

import {AuthService} from "../auth/auth.service";
import {SessionService} from "../base/services/session.service";
import {AccountsService} from "./accounts.service";

@Component({
	selector: "accounts",
	templateUrl: "./accounts.component.html",
	styleUrls: ["./accounts.component.css"],
})

/**
 * アカウントレコード
 *
 * @since 0.01
 */
export class AccountsComponent extends SessionableComponent implements OnInit, AfterContentInit {

	public get isProgress(): boolean {
		return this.progress;
	}

	public results: any[];

	public progress: boolean;

	public gridByBreakpoint: object = {xl: 8, lg: 6, md: 4, sm: 2, xs: 1};

	@ViewChild("grid") public grid: MatGridList;

	public nickname = "";
	public size: number = 20;
	public count: number;

	protected service: AccountsService;
	protected auth_service: AuthService;
	protected query: object = {};
	protected page: number = 0;

	/**
	 *
	 * @param session
	 * @param authService
	 * @param accountService
	 * @param change
	 * @param observableMedia
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		public session: SessionService,
		public authService: AuthService,
		public accountService: AccountsService,
		public change: ChangeDetectorRef,
		private observableMedia: MediaObserver,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, change);
		this.service = accountService;
		this.auth_service = authService;
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
		this.service.get(id, (error: IErrorObject, result: object): void => {
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
		this.service.put(id, data, (error: IErrorObject, result: object): void => {
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
		this.service.delete(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * 完了通知
	 * @param type
	 * @param value
	 * @constructor
	 */
	protected Complete(type: string, value: object): void {
		this.complete.emit({type, value});
	}

	/**
	 * エラー表示
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * 処理中
	 * @param value
	 * @constructor
	 */
	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	/**
	 *
	 */
	public ngAfterContentInit(): void {
		this.observableMedia.media$.subscribe((change: MediaChange) => { // for responsive
			this.grid.cols = this.gridByBreakpoint[change.mqAlias];
		});
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.Progress(false);
		this.page = 0;
		this.query = {};

		this.results = [];
		this.getSession((error: IErrorObject, session: object): void => {
			this.draw((error: IErrorObject, accounts: object[]): void => {
				if (!error) {
					this.results = accounts;
				} else {
					this.errorBar(error);
				}
			});
		});
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
		this.draw((error: IErrorObject, accounts: object[]): void => {
			if (!error) {
				this.results = accounts;
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * 再描画
	 * @param callback
	 */
	public draw(callback: Callback<object>): void {
		this.Progress(true);
		this.service.count(this.query, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.count = result.value;
				const option = {sort: {auth: 1}, skip: this.size * this.page, limit: this.size};
				this.service.query(this.query, option, (error: IErrorObject, results: any[]): void => {
					if (!error) {
						const accounts: object[] = [];
						results.forEach((result) => {
							result.cols = 1;
							result.rows = 1;
							accounts.push(result);
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
	public Page(event): void {
		this.page = event.pageIndex;
		this.draw((error: IErrorObject, accounts: object[]): void => {
			if (!error) {
				this.results = accounts;
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * クリエイトダイアログ
	 */
	public createDialog(): void {
		const dialog: any = this.matDialog.open(RegistDialogComponent, {
			width: "40vw",
			height: "fit-content",
			data: {
				session: this.currentSession,
				content: {
					title: "Regist",
					username: "",
					password: "",
					nickname: "",
				},
				service: this.service,
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
				this.auth_service.regist_immediate(username, password, metadata, (error: IErrorObject, result: object): void => {
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
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(AccountDialogComponent, {
					width: "90vw",
					height: "fit-content",
					data: {
						session: this.currentSession,
						user: result,
						content: AccountsComponent.confirmToForm(result),
						service: this.service,
					},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: object): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.update(id, AccountsComponent.confirmToModel(result), (error: IErrorObject, result: object): void => {
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
		const resultDialogContent: any = {title: "User", message: "Delete User?."};

		const dialog: any = this.matDialog.open(InfoDialogComponent, {
			width: "40vw",
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
	}

}
