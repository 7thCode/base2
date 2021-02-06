/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Callback, IErrorObject} from "../../../../../types/platform/universe";

import {Directive, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {MatSnackBar} from "@angular/material/snack-bar";

import {ResponsiveComponent} from "../../../platform/base/components/responsive.component";

import {SessionService} from "../../../platform/base/services/session.service";
import {BlogsService} from "../blog-base.service";

@Directive()
export class BlogBaseDescriptionComponent extends ResponsiveComponent implements OnInit {

	public id: string = "";
	public description: SafeHtml;
	public images: { name: string }[] = [];

	protected service: BlogsService;

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

	/**/
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 8000,
			});
		}
	}

	/**/
	public ngOnInit(): void {
		this.getSession((error: IErrorObject, session: object | null): void => {
			this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
				this.id = params.get('id');
				this.draw((error, blogpage: any) => {
					if (!error) {
						this.description = this.domSanitizer.bypassSecurityTrustHtml(blogpage.value.description);
						this.images = blogpage.accessory.images;
					} else {
						this.errorBar(error);
					}
				})
			});
		});
	}

	/**
	 * 再描画
	 * @param callback コールバック
	 */
	public draw(callback: Callback<object>): void {
		this.service.get(this.id, (error: IErrorObject, result: any): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/*
	*
	*/
	public imagePath(): string {
		let path = "";
		if (this.images) {
			if (this.images.length > 0) {
				path = "/files/get/" + this.images[0].name;
			}
		}
		return path;
	}

}
