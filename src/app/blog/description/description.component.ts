/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";

import {MatSnackBar} from "@angular/material/snack-bar";
import {SessionService} from "../../platform/base/services/session.service";

import {DomSanitizer, Meta, Title} from '@angular/platform-browser';

import {BlogBaseDescriptionComponent} from "../../plugins/blog-base/blog-base-description/blog-base-description.component";
import {BlogService} from "../blog.service";
import {IErrorObject} from "../../../../types/platform/universe";
import {environment} from "../../../environments/environment";

@Component({
	selector: "blog-description",
	templateUrl: "./description.component.html",
	styleUrls: ["./description.component.css"]
})

export class BlogDescriptionComponent extends BlogBaseDescriptionComponent implements OnInit {

	constructor(
		protected session: SessionService,
		protected blogsService: BlogService,
		protected breakpointObserver: BreakpointObserver,
		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected snackbar: MatSnackBar,
		protected router: Router,
		protected title: Title,
		protected meta: Meta
	) {
		super(session, blogsService, breakpointObserver, domSanitizer, activatedRoute, snackbar, router, title, meta);
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
							this.title.setTitle(blogpage.content.value.title);
							meta.description.push({name: 'keywords', content: blogpage.content.accessory.keyword});
							meta.description.push({name: 'description', content: blogpage.content.accessory.description});
							this.setDescription(meta);

							this.description = this.domSanitizer.bypassSecurityTrustHtml(blogpage.content.value.description);
							this.images = blogpage.content.accessory.images;
						} else {
							this.errorBar(error);
						}
					})
				});
			}
		});
	}


}
