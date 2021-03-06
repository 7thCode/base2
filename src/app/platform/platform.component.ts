/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../types/platform/universe";

import {BreakpointObserver} from "@angular/cdk/layout";
import {Overlay} from "@angular/cdk/overlay";
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSidenav} from "@angular/material/sidenav";
import {MatSnackBar} from "@angular/material/snack-bar";

import {AccountDialogComponent} from "./accounts/account-dialog/account-dialog.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {ResponsiveComponent} from "./base/components/responsive.component";

import {environment} from '../../environments/environment';

import {AccountsService} from "./accounts/accounts.service";
import {SessionService} from "./base/services/session.service";

import {fadeAnimation} from "./base/library/fade-animation";

/**
 * プラットフォーム
 *
 * @since 0.01
 */
@Component({
	selector: "platform-root",
	templateUrl: "./platform.component.html",
	styleUrls: ["./platform.component.css"],
	animations: [fadeAnimation], // register the animation,
})
export class PlatformComponent extends ResponsiveComponent implements OnInit, OnDestroy {

	public widthValue: number;
	public sock: any;
	public date: Date;

	public device: string;

	@ViewChild("sidenav") protected sidenav: MatSidenav;
	@ViewChild(AccountsComponent) protected accountsComponent: AccountsComponent;

	private accountsService: AccountsService;

	/**
	 *
	 * @param session
	 * @param accountService
	 * @param change
	 * @param overlay
	 * @param snackbar
	 * @param elementRef
	 * @param matDialog
	 * @param breakpointObserver
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		protected snackbar: MatSnackBar,
		protected breakpointObserver: BreakpointObserver,
		private accountService: AccountsService,
		private change: ChangeDetectorRef,
		private elementRef: ElementRef,
		private matDialog: MatDialog,
	) {
		super(session, overlay, snackbar, breakpointObserver);
		this.widthValue = 0;
		this.sock = null;
		this.date = new Date();
		this.device = "";
		this.accountsService = accountService;
		this.sock = new WebSocket(environment.webSocket);
	}

	/*
	*
	*
	* */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 0,
			});
		}
	}

	/**
	 * アカウント参照
	 *
	 * @param id アカウントレコードID
	 * @param callback コールバック
	 */
	private get(id: string, callback: Callback<any>): void {
		this.Progress(true);
		this.accountsService.get(id, (error: IErrorObject, result: any): void => {
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
	 *
	 * @param id アカウントレコードID
	 * @param data 更新データ
	 * @param callback コールバック
	 */
	private update(id: string, data: object, callback: Callback<any>): void {
		this.Progress(true);
		this.accountsService.put(id, data, (error: IErrorObject, result: any): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 *
	 * @param opened
	 */
	public close(opened: any): void {
		if (opened) {
			this.sidenav.close().then(() => {

			});
		}
	}

	/**
	 *
	 * @param event
	 */
	public onPan(event: any): void {
	}

	/**
	 *
	 * @param event
	 */
	public onTap(event: any): void {
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		super.ngOnInit();

		this.Progress(true);

		this.isHandset.subscribe((layoutDetector: any) => {
			if (layoutDetector.matches) {
				this.device = "handset";
			}
		});

		this.isTablet.subscribe((layoutDetector: any) => {
			if (layoutDetector.matches) {
				this.device = "tablet";
			}
		});

		this.isDesktop.subscribe((layoutDetector: any) => {
			if (layoutDetector.matches) {
				this.device = "desktop";
			}
		});

		// for ws
		this.sock.addEventListener("open", (e: any) => {
		});

		this.sock.addEventListener("message", (e: any) => {
		});

		this.sock.addEventListener("close", (e: any) => {
		});

		this.sock.addEventListener("error", (e: any) => {
		});

		this.getSession((error: IErrorObject, session: object | null): void => {
			this.widthValue = 200;
			this.Progress(false);
		});
	}

	/**
	 *
	 */
	public ngOnDestroy(): void { //
	}

	/**
	 *
	 * @param width 幅
	 */
	public setWidth(width: string): void {
	}

	/**
	 *
	 * @param data
	 */
	public onRegist(data: any): void { //
	}

	/**
	 *
	 * @param data
	 */
	public onPassword(data: any): void { //
	}

	/**
	 *
	 * @param data
	 */
	public onLogin(data: any): void {
		location.reload();
	}

	/**
	 *
	 * @param data
	 */
	public onLogout(data: any): void {
		location.reload();
	}

	/**
	 *
	 */
	public onUpdateAvatar(): void {
		this.onComplete({type: "", value: null});
	}

	/**
	 *
	 * @param progress
	 */
	public onProgressed(progress: any): void {
		this.Progress(progress);
	}

	/**
	 * コンプリート
	 * @param event
	 */
	public onComplete(event: any): void {
		switch (event.type) {
			case "error" :
				this.errorBar(event.value);
				break;
			default:
		}
		this.accountsComponent.draw((error, results) => {
			this.change.detectChanges();
		});
	}

	/**
	 *
	 * @param viewName
	 */
	public changeView(viewName: string): void {
	}

	/**
	 * 更新ダイアログ
	 */
	public updateDialog(): void {
		const id: string = this.currentSession.username;
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: MatDialogRef<any> = this.matDialog.open(AccountDialogComponent, {
					width: "fit-content",
					height: "fit-content",
					data: {
						session: this.currentSession,
						user: result,
						content: AccountsComponent.confirmToForm(result),
						service: this.accountsService,
					},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: object): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.update(id, AccountsComponent.confirmToModel(result), (error, result: any): void => {
							if (error) {
								this.errorBar(error);
							}
							this.Progress(false);
						});
					}
				});

				dialog.afterClosed().subscribe((result: object): void => { //

				});
			} else {
				this.errorBar(error);
			}
		});
	}
}
