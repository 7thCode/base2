/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import { Router } from '@angular/router';  // 変更
import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BlogsService} from "../../plugins/blog-base/blog-base.service";

import {BlogBaseArchiveComponent} from "../../plugins/blog-base/blog-base-archive/blog-base-archive.component";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
	selector: "blog-archive",
	templateUrl: "./archive.component.html",
	styleUrls: ["./archive.component.css"]
})

export class BlogArchiveComponent extends BlogBaseArchiveComponent implements OnInit {

	/**
	 *
	 * @param session
	 * @param blogsService
	 * @param breakpointObserver
	 * @param domSanitizer
	 * @param activatedRoute
	 * @param snackbar
	 * @param router
	 */
	public constructor(
		protected session: SessionService,
		protected blogsService: BlogsService,
		protected breakpointObserver: BreakpointObserver,
		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected snackbar: MatSnackBar,
		private router: Router
	) {
		super(session, blogsService, breakpointObserver,domSanitizer, activatedRoute, snackbar);
	}

	public click(resource: any): void {
		this.router.navigate(['/blog/description/' + resource.id]);
	}

}
