/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Directive, OnInit} from "@angular/core";
import {SessionService} from "../../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Callback, IErrorObject} from "../../../../../types/platform/universe";
import {BlogBaseService} from "../blog-base.service";
import {ResponsiveComponent} from "../../../platform/base/components/responsive.component";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {Overlay} from "@angular/cdk/overlay";
import {MatDialog} from "@angular/material/dialog";

@Directive()
export class BlogBaseArchiveComponent extends ResponsiveComponent implements OnInit {

	public results: any[] = [];

	private service: BlogBaseService;

	private type: string;
	private skip: number;

	constructor(
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
		super(session, breakpointObserver);
		this.service = blogsService;
	}

	/**
	 * エラー表示
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

	/**
	 */
	public ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
			this.type = params.get('type');
			this.skip = Number(params.get('skip'));
			this.draw((error: IErrorObject, results: any) => {
				if (!error) {
					this.results = results[0].entries;
				} else {
					this.errorBar(error);
				}
			})
		});
	}

	/**
	 * 再描画
	 * @param callback コールバック
	 */
	public draw(callback: Callback<object[]>): void {
		const query = {"content.category":"blog"};
		const option = {sort: {_id: -1}, limit: 1, skip: this.skip};
		this.service.group_by(this.type, query, option, (error: IErrorObject, results: any[]): void => {
			if (!error) {
				callback(null, results);
			} else {
				callback(error, null);
			}
		});
	}

	public sanitize(text: string) {
		return this.domSanitizer.bypassSecurityTrustHtml(text);
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
