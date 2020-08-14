/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IArticleModelContent, IErrorObject} from "../../../../types/platform/universe";

import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../base/components/gridview.component";
import {ArticleDialogComponent} from "./article-dialog/article-dialog.component";

import {SessionService} from "../base/services/session.service";
import {ArticlesService} from "./articles.service";
import {InfoDialogComponent} from "../base/components/info-dialog/info-dialog.component";

/**
 * アーティクル
 *
 * @since 0.01
 */
@Component({
	selector: "articles",
	templateUrl: "./articles.component.html",
	styleUrls: ["./articles.component.css"],
})
export class ArticlesComponent extends GridViewComponent implements OnInit {

	/**
	 *
	 * @param session
	 * @param articleService
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected matDialog: MatDialog,
		private articleService: ArticlesService,
		private snackbar: MatSnackBar,
	) {
		super(session, matDialog);
		this.service = articleService;
	}

	/**
	 * エラー表示
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 0,
			});
		}
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
	 * クリエイトダイアログ
	 */
	public createDialog(): void {

		const initalData: IArticleModelContent = {
			id: "",
			parent_id: "",
			enabled: true,
			category: "",
			status: 0,
			type: "",
			name: "",
			value: {title: "", description: ""},
			accessory: {},
		};

		const dialog: MatDialogRef<any> = this.matDialog.open(ArticleDialogComponent, {
			width: "fit-content",
			height: "fit-content",
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

	/**
	 * アップデートダイアログ
	 * @param id ターゲット
	 */
	public updateDialog(id: string): void {
		this.get(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				const dialog: MatDialogRef<any> = this.matDialog.open(ArticleDialogComponent, {
					width: "fit-content",
					height: "fit-content",
					data: {content: this.toView(result)},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: any): void => {
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

				dialog.afterClosed().subscribe((result: any): void => {
					this.Complete("", result);
				});
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * 削除
	 * @param id ターゲット
	 */
	public onDelete(event: any, id: string): void {

		const _delete = (id: string): void => {
			this.Progress(true);
			this.delete(id, (error: IErrorObject, result: any): void => {
				if (!error) {
					this.Complete("", result);
				} else {
					this.Complete("error", error);
				}
				this.Progress(false);
			});
		};

		if (event.shiftKey) { // dialog?
			_delete(id);
		} else {
			const resultDialogContent: any = {title: "Articles", message: "Delete this?."};
			const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
				width: "fit-content",
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
