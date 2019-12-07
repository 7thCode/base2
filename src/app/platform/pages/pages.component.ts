/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IPageModelContent} from "../../../../types/universe";

import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component} from "@angular/core";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {GridViewComponent} from "../base/components/gridview.component";
import {ConstService} from "../base/services/const.service";
import {SessionService} from "../base/services/session.service";
import {PageDialogComponent} from "./page-dialog/page-dialog.component";
import {PagesService} from "./pages.service";

@Component({
	selector: "pages",
	templateUrl: "./pages.component.html",
	styleUrls: ["./pages.component.css"],
})

/**
 *
 *
 * @since 0.01
 */
export class PagesComponent extends GridViewComponent {

	public path = "";

	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected constService: ConstService,
		protected change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		protected observableMedia: MediaObserver,
		protected snackbar: MatSnackBar
	) {
		super(session, http, change, matDialog, observableMedia);
		this.service = new PagesService(http, constService);
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public createDialog(): void {

		const initalData: IPageModelContent = {
			id: "",
			parent_id: "",
			enabled: true,
			category: "html",
			status: 0,
			type: "text/html",
			path: "index.html",
			value: "",
			accessory: {},
		};

		const dialog: any = this.matDialog.open(PageDialogComponent, {
			width: "90vw",
			data: {content: this.toView(initalData)},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: object): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				this.create(this.confirmToModel(result), (error: IErrorObject, result: object): void => {
					if (error) {
						this.Complete("error", error);
					}
					this.Progress(false);
				});
			}
		});

		dialog.afterClosed().subscribe((result: object): void => {
			this.Complete("", result);
		});

	}

	/**
	 * @returns none
	 */
	public findByPath(): void {
		this.query = {};
		if (this.path) {
			this.query = {"content.path": {$regex: this.path}};
		}

		this.draw((error: IErrorObject, filtered: object[]): void => {
			if (!error) {
				this.results = filtered;
				this.Complete("", filtered);
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * @returns none
	 */
	public updateDialog(id: string): void {
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog = this.matDialog.open(PageDialogComponent, {
					width: "90vw",
					data: {content: this.toView(result)},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: {content: object}): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.update(id, this.confirmToModel(result.content), (error: IErrorObject, result: any): void => {
							if (error) {
								this.Complete("error", error);
							}
							this.Progress(false);
						});
					}
				});

				dialog.afterClosed().subscribe((result: object): void => {
					this.Complete("", result);
				});
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * @returns none
	 */
	public onDelete(id: string): void {
		this.Progress(true);
		this.delete(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				this.Complete("", result);
			} else {
				this.Complete("error", error);
			}
			this.Progress(false);
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

}
