/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IPageModelContent} from "../../../../types/platform/universe";

import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../base/components/gridview.component";
import {PageDialogComponent} from "./page-dialog/page-dialog.component";

import {SessionService} from "../base/services/session.service";
import {PagesService} from "./pages.service";

/**
 * ページ
 *
 * @since 0.01
 */
@Component({
	selector: "pages",
	templateUrl: "./pages.component.html",
	styleUrls: ["./pages.component.css"],
})
export class PagesComponent extends GridViewComponent implements OnInit {

	public path = "";

	/**
	 * @constructor
	 * @param session
	 * @param pageSerrvice
	 * @param change
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected pageSerrvice: PagesService,

		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, matDialog);
		this.service = pageSerrvice;
	}

	/**
	 *
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
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

	public ngOnInit(): void {
		this.sort = {};
		super.ngOnInit();
	}

	/**
	 *
	 * ページ作成ダイアログ
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
			height: "fit-content",
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
	 * 検索
	 */
	public findByPath(): void {
		this.query = {};
		this.page = 0;
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
	 * ページ更新ダイアログ
	 * @param id ターゲット
	 */
	public updateDialog(id: string): void {
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(PageDialogComponent, {
					width: "90vw",
					height: "fit-content",
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
	 * ページ削除
	 * @param id ターゲット
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

}
