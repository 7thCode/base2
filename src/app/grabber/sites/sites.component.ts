/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {ChangeDetectorRef, Component, OnInit} from "@angular/core";

import {MediaObserver} from "@angular/flex-layout";

import {IErrorObject} from "../../../../types/platform/universe";

import {ConstService} from "../../config/const.service";
import {SessionService} from "../../platform/base/services/session.service";
import {SitesService} from "./sites.service";

import {GridViewComponent} from "../../platform/base/components/gridview.component";
import {SrcsService} from "../srcs/srcs.service";
import {SiteDialogComponent} from "./site-dialog/site-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
	selector: "app-sites",
	templateUrl: "./sites.component.html",
	styleUrls: ["./sites.component.css"],
})

export class SitesComponent extends GridViewComponent implements OnInit {

	public results: object[];

	public progress: boolean;

	public get isProgress(): boolean {
		return this.progress;
	}

	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	protected service: SitesService;
	protected srcs_service: SrcsService;

	public name = "";
	public url = "";

	protected query: object = {};
	protected page: number = 0;
	public size: number = 20;
	public count: number;

	constructor(
		public session: SessionService,
		public constService: ConstService,
		public srcsService: SrcsService,
		public sitesService: SitesService,
		// protected http: HttpClient,
		public change: ChangeDetectorRef,
		public observableMedia: MediaObserver,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, change, matDialog, observableMedia);
		this.service = sitesService; // new SitesService(http, constService);
		this.srcs_service = srcsService; // new SrcsService(http, constService);
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

	/**
	 * @returns none
	 */
	public createDialog(): void {

		const initalData: any = {
			url: "",
			status: 0,
			name: "",
		};

		const dialog: any = this.matDialog.open(SiteDialogComponent, {
			width: "40vw",
			data: {content: this.toView(initalData)},
			disableClose: true,
		});


		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);

				this.create(this.confirmToModel(result), (error: IErrorObject, result: any): void => {
					if (error) {
						this.Complete("error", error);
					}
					this.Progress(false);
				});
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});

	}
}
