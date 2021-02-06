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
import {BlogsService} from "../blog-base.service";
import {ResponsiveComponent} from "../../../platform/base/components/responsive.component";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Directive()
export class BlogBaseArchiveComponent extends ResponsiveComponent implements OnInit {

	public results: any[] = [];

	private service: BlogsService;

	private type: string;
	private skip: number;

	constructor(
		protected session: SessionService,
		protected blogsService: BlogsService,
		protected breakpointObserver: BreakpointObserver,
		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected snackbar: MatSnackBar,
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
		const option = {sort: {_id: 1}, limit: 1, skip: this.skip};
		this.service.group_by(this.type, {}, option, (error: IErrorObject, results: any[]): void => {
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

}