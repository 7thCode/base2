/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Directive, OnInit} from "@angular/core";
import {SessionService} from "../../../platform/base/services/session.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {UpdatableComponent} from "../../../platform/base/components/updatable.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Spinner} from "../../../platform/base/library/spinner";
import {Overlay} from "@angular/cdk/overlay";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IErrorObject} from "../../../../../types/platform/universe";
// import {BlogBaseDialogComponent} from "../blog-base-dialog/blog-base-dialog.component";
import {YesNoDialogComponent} from "../../../platform/base/components/yes-no-dialog/yes-no-dialog.component";
import {BlogBaseService} from "../blog-base.service";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

@Directive()
export abstract class BlogBasePageComponent extends UpdatableComponent implements OnInit {

	public get isProgress(): boolean {
		return this.spinner.progress;
	}

	public isHandset: any; // 360 – 399
	public isTablet: any; // 600 – 719
	public isDesktop: any;

	protected spinner: Spinner;

	public constructor(
		protected session: SessionService,
		protected blogsService: BlogBaseService,
		protected breakpointObserver: BreakpointObserver,
		protected overlay: Overlay,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,

		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected router: Router,
		protected title: Title,
		protected meta: Meta,
	) {
		super(session, matDialog);
		this.service = blogsService;
		this.spinner = new Spinner(overlay);
	}

	/**
	 * エラー表示
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
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
	protected messageBar(message: string): void {
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

	/*
	public ngOnInit(): void {
		this.sort = {};
		super.ngOnInit();
		this.isHandset = this.breakpointObserver.observe([
			Breakpoints.HandsetPortrait,
		]);
		this.isTablet = this.breakpointObserver.observe([
			Breakpoints.TabletPortrait,
		]);
		this.isDesktop = this.breakpointObserver.observe([
			Breakpoints.Web,
		]);
	}
	*/


	/**
	 * クリエイトダイアログ
	 */
	/*
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
				images: [
					{name: "", description: {}},
					{name: "", description: {}},
					{name: "", description: {}},
					{name: "", description: {}}
				]
			},
		};

		const dialog: MatDialogRef<any> = this.matDialog.open(BlogBaseDialogComponent, {
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
*/
	/**
	 * アップデートダイアログ
	 * @param id ターゲット
	 */

	/*
	public updateDialog(id: string): void {
		this.get(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				const dialog: MatDialogRef<any> = this.matDialog.open(BlogBaseDialogComponent, {
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
*/
	/**
	 * 削除
	 * @param event
	 * @param id ターゲット
	 */
	/*
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
			const resultDialogContent: any = {title: "Articles", message: "Delete this?"};
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
*/
	/*
	public imagePath(article: any): string {
		let path = "";
		if (article.accessory) {
			if (article.accessory.images) {
				if (article.accessory.images.length > 0) {
					path = "/files/get/" + article.accessory.images[0].name;
				}
			}
		}
		return path;
	}
*/
	/*
	public imagePath(images: any[], index: number): string {
		let path = "";

		if (images) {
			if (images.length > index) {
				if (images[index].name) {
					path = "/pfiles/get/" + images[index].name;
				}
			}
		}

		return path;
	} */

	public imagePath(images: any[], index: number): string {
		let path = "";

		if (images) {
			if (images.length > index) {
				if (images[index].name) {
					path = "/pfiles/get/" + images[index].name;
				}
			}
		}

		return path;
	}

	public imageName(images: any[], index: number): string {
		let name = "";

		if (images) {
			if (images.length > index) {
				if (images[index].name) {
					name = images[index].name;
				}
			}
		}

		return name;
	}

	public mimeToMedia(mime: string): string {
		let result = "";
		if (mime) {
			const type: string[] = mime.split("/");
			if (type.length >= 2) {
				result = type[0].toLocaleLowerCase();
			}
		}
		return result;
	}

	public imageMedia(images: any[], index: number): string {
		let type = "";

		if (images) {
			if (images.length > index) {
				if (images[index].type) {
					type = this.mimeToMedia(images[index].type);
				}
			}
		}
		return type;
	}
}
