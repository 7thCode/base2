/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {MediaMatcher} from "@angular/cdk/layout";
import {Overlay} from "@angular/cdk/overlay";
import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatSidenav, MatSnackBar} from "@angular/material";
import {ActivatedRoute} from "@angular/router";

import {Callback, IErrorObject} from "../../../types/universe";
import {AccountDialogComponent} from "./accounts/account-dialog/account-dialog.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {AccountsService} from "./accounts/accounts.service";
import {ResponsiveComponent} from "./base/components/responsive.component";
import {fadeAnimation} from "./base/library/fade-animation";
import {ConstService} from "./base/services/const.service";
import {SessionService} from "./base/services/session.service";
import {FilesComponent} from "./files/files.component";
import {PagesComponent} from "./pages/pages.component";
import {VaultsComponent} from "./vaults/vaults.component";

@Component({
	selector: "platform-root",
	templateUrl: "./platform.component.html",
	styleUrls: ["./platform.component.css"],
	animations: [fadeAnimation], // register the animation,
})

/**
 *
 *
 * @since 0.01
 */
export class PlatformComponent extends ResponsiveComponent implements OnInit, OnDestroy {

	private accountsService: AccountsService;

	public widthValue: number;
	public sock: any;
	public date: Date;

	@ViewChild("sidenav", {static: false}) protected sidenav: MatSidenav;
	@ViewChild(AccountsComponent, {static: true}) protected accountsComponent: AccountsComponent;
	@ViewChild(VaultsComponent, {static: true}) protected vaultsComponent: VaultsComponent;
	@ViewChild(PagesComponent, {static: true}) protected pagesComponent: PagesComponent;
	@ViewChild(FilesComponent, {static: true}) protected filesComponent: FilesComponent;

	constructor(
		public session: SessionService,
		public http: HttpClient,
		public constService: ConstService,
		public media: MediaMatcher,
		public change: ChangeDetectorRef,
		protected overlay: Overlay,
		protected snackbar: MatSnackBar,
		private elementRef: ElementRef,
		private matDialog: MatDialog,
	) {
		super(session, change, overlay, snackbar, media);
		this.accountsService = new AccountsService(http, constService);
		this.sock = new WebSocket(constService.webSocket);
	}

	public close(opened) {
		if (opened) {
			this.sidenav.close().then(() => {

			});
		}
	}

	// test
	public onPan(event) {
		// 	console.log(event);
	}

	public onTap(event) {
		// 	console.log(event);
	}

	public ngOnInit() {
		this.Progress(true);

		// for ws
		this.sock.addEventListener("open", (e) => {
		});

		this.sock.addEventListener("message", (e) => {
			// 	console.log(JSON.parse(e.data).username);
		});

		this.sock.addEventListener("close", (e) => {
		});

		this.sock.addEventListener("error", (e) => {
		});

		this.getSession((error: IErrorObject, session: object): void => {
			this.widthValue = 200;
			this.Progress(false);
		});
	}

	public ngOnDestroy(): void { //
	}

	public setWidth(width: string): void {
	}

	public onRegist(data: any): void { //
	}

	public onPassword(data: any): void { //
	}

	public onLogin(data: any): void {
		location.reload();
	}

	public onLogout(data: any): void {
		location.reload();
	}

	public onUpdateAvatar(): void {
		this.onComplete({type: "", value: null});
	}

	public onProgressed(progress: any): void {
		this.Progress(progress);
	}

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

	public changeView(viewName: string): void {
	}

	public updateDialog(): void {
		const id: string = this.currentSession.username;
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(AccountDialogComponent, {
					width: "90vw",
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
}
