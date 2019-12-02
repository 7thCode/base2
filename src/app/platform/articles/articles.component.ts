/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component} from "@angular/core";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {IArticleModelContent, IErrorObject} from "../../../../types/universe";
import {GridViewComponent} from "../base/components/gridview.component";
import {ConstService} from "../base/services/const.service";
import {SessionService} from "../base/services/session.service";
import {ArticleDialogComponent} from "./article-dialog/article-dialog.component";
import {ArticlesService} from "./articles.service";

@Component({
	selector: "articles",
	templateUrl: "./articles.component.html",
	styleUrls: ["./articles.component.css"],
})

/**
 *
 *
 * @since 0.01
 */
export class ArticlesComponent extends GridViewComponent {

	constructor(
		public session: SessionService,
		public http: HttpClient,
		public constService: ConstService,
		public change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		protected observableMedia: MediaObserver,
		protected snackbar: MatSnackBar
	) {
		super(session, http, change, matDialog, observableMedia);
		this.service = new ArticlesService(http, constService);
	}

	// , private snackbar: MatSnackBar
	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
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
	 * @returns none
	 */
	public updateDialog(id: string): void {
		this.get(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(ArticleDialogComponent, {
					width: "40vw",
					height: "40vh",
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
	 * @returns none
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

	/**
	 * @returns none
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

}
