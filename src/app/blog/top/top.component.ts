/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Overlay} from "@angular/cdk/overlay";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BlogBaseTopComponent} from "../../plugins/blog-base/blog-base-top/blog-base-top.component";
import {BlogService} from "../blog.service";
import {IArticleModelContent, IErrorObject} from "../../../../types/platform/universe";
import {BlogDialogComponent} from "../blog-dialog/blog-dialog.component";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
	selector: "blog-top",
	templateUrl: "./top.component.html",
	styleUrls: ["./top.component.css"]
})

export class BlogTopComponent extends BlogBaseTopComponent implements OnInit {

	public constructor(
		protected session: SessionService,
		protected blogsService: BlogService,
		protected breakpointObserver: BreakpointObserver,
		protected overlay: Overlay,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,

		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected router: Router,
		protected title: Title,
		protected meta: Meta
	) {
		super(session, blogsService, breakpointObserver, overlay, matDialog, snackbar,	 domSanitizer, activatedRoute, router, title, meta);
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
			accessory: {
				keyword: "",
				description: "",
				images: [
					{name: "", description: {}},
					{name: "", description: {}},
					{name: "", description: {}},
					{name: "", description: {}}
				]
			},
		};

		const dialog: MatDialogRef<any> = this.matDialog.open(BlogDialogComponent, {
			minWidth: "320px",
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
				const dialog: MatDialogRef<any> = this.matDialog.open(BlogDialogComponent, {
					minWidth: "320px",
					height: "fit-content",
					data: this.toView(result),
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
}
