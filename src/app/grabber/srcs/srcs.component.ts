/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {ChangeDetectorRef, Component, OnInit} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {IErrorObject} from "../../../../types/platform/universe";

import {ConstService} from "../../config/const.service";
import {SessionService} from "../../platform/base/services/session.service";
import {SrcsService} from "./srcs.service";

import {GridViewComponent} from "../../platform/base/components/gridview.component";
import {SrcDialogComponent} from "./src-dialog/src-dialog.component";

@Component({
	selector: "app-srcs",
	templateUrl: "./srcs.component.html",
	styleUrls: ["./srcs.component.css"],
})

export class SrcsComponent extends GridViewComponent implements OnInit {

	public results: object[];

	public progress: boolean;

	public get isProgress(): boolean {
		return this.progress;
	}

	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	protected service: SrcsService;

	public src = "";
	public alt = "";

	protected query: object = {};
	protected page: number = 0;
	public size: number = 20;
	public count: number;

	constructor(
		public session: SessionService,
		public constService: ConstService,
		public srcsService: SrcsService,
		// protected http: HttpClient,
		public change: ChangeDetectorRef,
		public observableMedia: MediaObserver,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, change, matDialog, observableMedia);
		this.service = srcsService; // new SrcsService(http, constService);
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public findBySrc(): void {
		this.query = {};
		this.page = 0;
		if (this.src) {
			this.query = {"content.src": {$regex: this.src}};
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
	public findByAlt(): void {
		this.query = {};
		this.page = 0;
		if (this.alt) {
			this.query = {"content.alt": {$regex: this.alt}};
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
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

	/**
	 * @returns none
	 */
	public urlDialog(image: any): void {
		const resultDialogContent: any = {
			src: image.src,
			alt: image.alt,
			url: image.url,
			description: image.description,
		};

		const dialog: any = this.matDialog.open(SrcDialogComponent, {
			width: "40vw",
			data: {
				session: this.currentSession,
				content: resultDialogContent,
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: object) => {

		});
	}

}
