/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IPageModelContent} from "../../../../types/platform/universe";

import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../base/components/gridview.component";
import {PageDialogComponent} from "./page-dialog/page-dialog.component";

import {SessionService} from "../base/services/session.service";
import {PagesService} from "./pages.service";
import {Overlay} from "@angular/cdk/overlay";
import {YesNoDialogComponent} from "../base/components/yes-no-dialog/yes-no-dialog.component";
import {Spinner} from "../base/library/spinner";

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

	public get isProgress(): boolean {
		return this.spinner.progress;
	}

	public path = "";

	protected spinner: Spinner;

	/**
	 * @constructor
	 * @param session
	 * @param pageSerrvice
	 * @param overlay
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		protected matDialog: MatDialog,
		protected pageSerrvice: PagesService,
		protected snackbar: MatSnackBar,
	) {
		super(session, matDialog);
		this.service = pageSerrvice;
		this.spinner = new Spinner(overlay);
	}

	/**
	 *
	 * @param error
	 */
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

	protected Progress(value: boolean): void {
		this.spinner.Progress(value);
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
			path: "",
			value: "",
			accessory: {},
		};

		const dialog: MatDialogRef<any> = this.matDialog.open(PageDialogComponent, {
			minWidth: "320px",
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

		this.draw((error: IErrorObject, results: object[] | null): void => {
			if (!error) {
				if (results) {
					this.results = results;
					this.Complete("", results);
				} else {
					this.Complete("error", {code: -1, message: "error."});
				}
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
				const dialog: MatDialogRef<any> = this.matDialog.open(PageDialogComponent, {
					minWidth: "320px",
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
	public onDelete(event: any, id: string): void {

		const _delete = (id: string): void => {
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

		if (event.shiftKey) { // dialog?
			_delete(id);
		} else {
			const resultDialogContent: any = {title: "Page", message: "Delete this?"};
			const dialog: MatDialogRef<any> = this.matDialog.open(YesNoDialogComponent, {
				width: "30%",
				minWidth: "320px",
				height: "fit-content",
				data: {
					session: this.currentSession,
					content: resultDialogContent,
				},
				disableClose: true,
			});
			dialog.afterClosed().subscribe((result: object) => {
				if (result) { // if not cancel then
					_delete(id);
				}
			});
		}

	}

}
