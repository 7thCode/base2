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
import {UpdatableComponent} from "../../../platform/base/components/updatable.component";
import {Spinner} from "../../../platform/base/library/spinner";
import {BlogBasePageComponent} from "../blog-base-page/blog-base-page.component";

@Directive()
export abstract class BlogBaseArchiveComponent extends BlogBasePageComponent implements OnInit {

	public results: any[] = [];

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
		super(session, blogsService, breakpointObserver, overlay, matDialog, snackbar,	 domSanitizer, activatedRoute, router, title, meta);
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





}
