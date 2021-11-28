/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Callback, IErrorObject} from "../../../../../types/platform/universe";

import {Directive, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";
import {DomSanitizer, Meta, SafeHtml, Title} from '@angular/platform-browser';

import {MatSnackBar} from "@angular/material/snack-bar";

import {ResponsiveComponent} from "../../../platform/base/components/responsive.component";

import {SessionService} from "../../../platform/base/services/session.service";
import {BlogBaseService} from "../blog-base.service";
import {environment} from "../../../../environments/environment";

@Directive()
export class BlogBaseDescriptionComponent extends ResponsiveComponent implements OnInit {

	public id: string = "";
	public create: any;
	public title: string;
	public description: SafeHtml;
	public images: { name: string }[] = [];

	protected service: BlogBaseService;

	constructor(
		protected session: SessionService,
		protected blogsService: BlogBaseService,
		protected breakpointObserver: BreakpointObserver,
		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected snackbar: MatSnackBar,
		protected router: Router,
		protected _title: Title,
		protected meta: Meta
	) {
		super(session, breakpointObserver);
		this.service = blogsService;
	}

	/**/
	protected errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
// 		duration: 8000,
			});
		}
	}

	/**/
	public setDescription(meta: { title: string, description: any[] }): void {
		meta.description.forEach((each_description) => {
			this.meta.updateTag(each_description);
		})
	}

	/**/
	public ngOnInit(): void {
		this.getSession((error: IErrorObject, session: object | null): void => {
			if (!error) {
				this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
					this.id = params.get('id');
					this.draw((error, blogpage: any) => {
						if (!error) {

							const meta = environment.meta.description;
							this._title.setTitle(blogpage.value.title);
							meta.description.push({name: 'keywords', content: blogpage.accessory.keyword});
							meta.description.push({name: 'description', content: blogpage.accessory.description});
							this.setDescription(meta);

							this.create = blogpage.value.create;
							this.title = blogpage.value.title;
							this.description = this.domSanitizer.bypassSecurityTrustHtml(blogpage.value.description);
							this.images = blogpage.accessory.images;
						} else {
							this.errorBar(error);
						}
					})
				});
			}
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
				if (this.images[0].name) {
					path = "/pfiles/get/" + this.images[0].name;
				}
			}
		}
		return path;
	}

}


