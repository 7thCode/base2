/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

import {BreakpointObserver} from "@angular/cdk/layout";
import {Overlay} from "@angular/cdk/overlay";
import {ChangeDetectorRef, Directive, ElementRef, OnDestroy, OnInit, VERSION, ViewChild} from "@angular/core";

import {MatDialog} from "@angular/material/dialog";
import {MatSidenav} from "@angular/material/sidenav";
import {MatSnackBar} from "@angular/material/snack-bar";

import {ResponsiveComponent} from "../../platform/base/components/responsive.component";

import {SessionService} from "../../platform/base/services/session.service";

import {Spinner} from "../../platform/base/library/spinner";

/**
 * プラットフォーム
 *
 * @since 0.01
 */
@Directive()
export class BlogBaseComponent extends ResponsiveComponent implements OnInit, OnDestroy {

	public widthValue: number;
	public sock: any;
	public date: Date;

	public device: string;
	public angular: string;

	protected spinner: Spinner;

	@ViewChild("sidenav") protected sidenav: MatSidenav;

	/**
	 *
	 * @param session
	 * @param change
	 * @param overlay
	 * @param snackbar
	 * @param elementRef
	 * @param matDialog
	 * @param breakpointObserver
	 */
	constructor(
		protected session: SessionService,
		protected breakpointObserver: BreakpointObserver,
		protected overlay: Overlay,
		protected change: ChangeDetectorRef,
		protected elementRef: ElementRef,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, breakpointObserver);
		this.widthValue = 0;
		this.date = new Date();
		this.device = "";
		this.spinner = new Spinner(overlay);
	}

	private Progress(value: boolean): void {
		this.spinner.Progress(value);
	}

	/*
	*
	*
	* */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 8000,
			});
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
				duration: 8000,
				panelClass: ["message-snackbar"]
			});
		}
	}

	/**
	 *
	 * @param opened
	 */
	public close(opened: any): void {
		if (opened) {
			this.sidenav.close().then((): void => {

			}).catch((error): void => {
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

		this.angular = VERSION.full;
		this.device = "desktop";

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

		this.isWeb.subscribe((layoutDetector: any) => {
			if (layoutDetector.matches) {
				this.device = "desktop";
			}
		});

		this.getSession((error: IErrorObject, session: object | null): void => {
			if (!error) {
				this.widthValue = 200;
			}
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
	public onUsername(data: any): void { //
	}

	/**
	 *
	 * @param data
	 */
	public onRemove(data: any): void { //
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
	}

	/**
	 *
	 * @param viewName
	 */
	public changeView(viewName: string): void {
	}

}
