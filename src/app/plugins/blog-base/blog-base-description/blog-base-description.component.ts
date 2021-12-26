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
import {Overlay} from "@angular/cdk/overlay";
import {MatDialog} from "@angular/material/dialog";
import {UpdatableComponent} from "../../../platform/base/components/updatable.component";
import {Spinner} from "../../../platform/base/library/spinner";
import {BlogBasePageComponent} from "../blog-base-page/blog-base-page.component";

@Directive()
export abstract class BlogBaseDescriptionComponent extends BlogBasePageComponent implements OnInit {

	public id: string = "";
	public _title_: string = "";
	public subtitle: string = "";
	public description: SafeHtml;
	public images: { name: string }[] = [];

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

	/**/
	public setDescription(meta: { title: string, description: any[] }): void {
		meta.description.forEach((each_description) => {
			this.meta.updateTag(each_description);
		})
	}

	/**/
	public ngOnInit(): void {

	// 	this.getSession((error: IErrorObject, session: object | null): void => {
	// 		if (!error) {
				this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
					this.id = params.get('id');
					this.draw((error, blogpage: any) => {
						if (!error) {
							const content = blogpage.content;
							const meta = environment.meta.description;
							this.title.setTitle(content.value.title);
							meta.description.push({name: 'keywords', content: content.accessory.keyword});
							meta.description.push({name: 'description', content: content.accessory.description});
							this.setDescription(meta);
							this._title_ = content.value.title;
							if (content.value.subtitle) {
								this.subtitle =  content.value.subtitle;
							}
							this.description = this.domSanitizer.bypassSecurityTrustHtml(content.value.description);
							this.images = content.accessory.images;
						} else {
							this.errorBar(error);
						}
					})
				});
	// 		}
	// 	});

	}

	/**
	 * 再描画
	 * @param callback コールバック
	 */
	public draw(callback: Callback<object[]>): void {
		this.service.get(this.id, (error: IErrorObject, result: any): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

}


