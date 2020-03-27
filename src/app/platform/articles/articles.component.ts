/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IArticleModelContent, IErrorObject} from "../../../../types/platform/universe";

import {ChangeDetectorRef, Component} from "@angular/core";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../base/components/gridview.component";
import {ArticleDialogComponent} from "./article-dialog/article-dialog.component";

import {SessionService} from "../base/services/session.service";
import {ArticlesService} from "./articles.service";

@Component({
	selector: "articles",
	templateUrl: "./articles.component.html",
	styleUrls: ["./articles.component.css"],
})

/**
 * アーティクル
 *
 * @since 0.01
 */
export class ArticlesComponent extends GridViewComponent {

	/**
	 *
	 * @param session
	 * @param articleService
	 * @param change
	 * @param matDialog
	 * @param observableMedia
	 * @param snackbar
	 */
	constructor(
		public session: SessionService,
		public articleService: ArticlesService,
		public change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		protected observableMedia: MediaObserver,
		protected snackbar: MatSnackBar,
	) {
		super(session, change, matDialog, observableMedia);
		this.service = articleService;
	}

	/**
	 * エラー表示
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

		const dialog: any = this.matDialog.open(ArticleDialogComponent, {
			width: "40vw",
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
				const dialog: any = this.matDialog.open(ArticleDialogComponent, {
					width: "40vw",
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
	public onDelete(id: string): void {
		this.Progress(true);
		this.delete(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.Complete("", result);
			} else {
				this.Complete("error", error);
			}
			this.Progress(false);
		});
	}

}
