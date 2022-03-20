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
import {YesNoDialogComponent} from "../../../platform/base/components/yes-no-dialog/yes-no-dialog.component";
import {BlogBaseService} from "../blog-base.service";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {Errors} from "../../../platform/base/library/errors";
import {BlogBasePageComponent} from "../blog-base-page/blog-base-page.component";

@Directive()
export abstract class BlogBaseTopComponent extends BlogBasePageComponent implements OnInit {

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
		protected meta: Meta
	) {
		super(session, blogsService, breakpointObserver, overlay, matDialog, snackbar,	 domSanitizer, activatedRoute, router, title, meta);
	}

	public ngOnInit(): void {
		this.query = {"content.category":"blog"};
		this.sort = {};
		this.page = 0;
		this.results = [];
		this.getSession((error: IErrorObject, session: object | null): void => {
			if (!error) {
				this.draw((error: IErrorObject, results: object[] | null): void => {
					if (!error) {
						if (results) {
							this.results = results;

							this.isHandset = this.breakpointObserver.observe([
								Breakpoints.HandsetPortrait,
							]);
							this.isTablet = this.breakpointObserver.observe([
								Breakpoints.TabletPortrait,
							]);
							this.isDesktop = this.breakpointObserver.observe([
								Breakpoints.Web,
							]);

							this.Complete("", results);

						} else {
							this.Complete("error", Errors.generalError(-1, "error.", "A00026"));
						}
					} else {
						this.Complete("error", error);
					}
				});
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * 削除
	 * @param event
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

}
