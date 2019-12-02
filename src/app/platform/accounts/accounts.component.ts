/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";
import {AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout"; // for responsive
import {MatDialog, MatGridList, MatSnackBar} from "@angular/material";

import {Callback, IErrorObject} from "../../../../types/universe";
import {AuthService} from "../auth/auth.service";
import {InfoDialogComponent} from "../base/components/info-dialog/info-dialog.component";
import {SessionableComponent} from "../base/components/sessionable.component";
import {ConstService} from "../base/services/const.service";
import {PublicKeyService} from "../base/services/publickey.service";
import {SessionService} from "../base/services/session.service";
import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {AccountsService} from "./accounts.service";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";

@Component({
	selector: "accounts",
	templateUrl: "./accounts.component.html",
	styleUrls: ["./accounts.component.css"],
})

/**
 *
 *
 * @since 0.01
 */
export class AccountsComponent extends SessionableComponent implements OnInit, AfterContentInit {

	public results: object[];

	public progress: boolean;

	public get isProgress(): boolean {
		return this.progress;
	}

	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	public gridByBreakpoint: object = {xl: 8, lg: 6, md: 4, sm: 2, xs: 1};

	@ViewChild("grid", {static: true}) public grid: MatGridList;

	public nickname = "";

	protected service: AccountsService;
	protected auth_service: AuthService;

	protected query: object = {};
	protected page: number = 0;
	public size: number = 20;
	public count: number;

	/**
	 * @returns none
	 */
	protected Complete(type: string, value: object): void {
		this.complete.emit({type, value});
	}

	/**
	 * @returns none
	 */
	public static confirmToForm(data: object): object {
		return data;
	}

	/**
	 * @returns none
	 */
	public static confirmToModel(data: object): object {
		return data;
	}

	constructor(
		public session: SessionService,
		public constService: ConstService,
		public publickeyservice: PublicKeyService,
		protected http: HttpClient,
		public change: ChangeDetectorRef,
		private observableMedia: MediaObserver,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar
	) {
		super(session, change);
		this.service = new AccountsService(http, constService);
		this.auth_service = new AuthService(http, constService, publickeyservice);
	}

	/**
	 * @returns none
	 */
	public ngAfterContentInit(): void {
		this.observableMedia.media$.subscribe((change: MediaChange) => { // for responsive
			this.grid.cols = this.gridByBreakpoint[change.mqAlias];
		});
	}

	/**
	 * @returns none
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

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public findByNickname(): void {
		this.query = {};
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
	 * @returns none
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

	public createDialog(): void {
		const dialog: any = this.matDialog.open(RegistDialogComponent, {
			width: "40vw",
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
	 * @returns none
	 */
	public updateDialog(id: string): void {
		this.Progress(true);
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(AccountDialogComponent, {
					width: "90vw",
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
	 * @returns none
	 */
	public deleteDialog(id: string): void {
		const resultDialogContent: any = {title: "User", message: "Delete User?."};

		const dialog: any = this.matDialog.open(InfoDialogComponent, {
			width: "40vw",
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

	/**
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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

}
