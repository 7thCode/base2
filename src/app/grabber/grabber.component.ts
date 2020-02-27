/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../types/platform/universe";

import {MediaMatcher} from "@angular/cdk/layout";
import {Overlay} from "@angular/cdk/overlay";
import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";


import {fadeAnimation} from "../platform/base/library/fade-animation";

import {ConstService} from "../config/const.service";
import {AccountsComponent} from "../platform/accounts/accounts.component";
import {AccountsService} from "../platform/accounts/accounts.service";
import {ResponsiveComponent} from "../platform/base/components/responsive.component";
import {SessionService} from "../platform/base/services/session.service";
import {SitesComponent} from "./sites/sites.component";
import {SrcsComponent} from "./srcs/srcs.component";

import {AccountDialogComponent} from "../platform/accounts/account-dialog/account-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSidenav} from "@angular/material/sidenav";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
	selector: "grabber-root",
	templateUrl: "./grabber.component.html",
	styleUrls: ["./grabber.component.css"],
	animations: [fadeAnimation], // register the animation,
})

/**
 *
 *
 * @since 0.01
 */
export class GrabberComponent extends ResponsiveComponent implements OnInit, OnDestroy {

	private accountsService: AccountsService;

	public widthValue: number;
	public sock: any;
	public date: Date;

	@ViewChild("sidenav", {static: false}) protected sidenav: MatSidenav;

	@ViewChild(SrcsComponent, {static: true}) protected imagesComponent: SrcsComponent;
	@ViewChild(SitesComponent, {static: true}) protected sitesComponent: SitesComponent;

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
