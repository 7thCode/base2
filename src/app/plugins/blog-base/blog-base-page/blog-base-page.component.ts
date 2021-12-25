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
