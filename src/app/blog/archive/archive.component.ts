/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {ActivatedRoute, Router} from '@angular/router'; // 変更
import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BlogBaseArchiveComponent} from "../../plugins/blog-base/blog-base-archive/blog-base-archive.component";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {BlogService} from "../blog.service";
import {Overlay} from "@angular/cdk/overlay";
import {MatDialog} from "@angular/material/dialog";

@Component({
	selector: "blog-archive",
	templateUrl: "./archive.component.html",
	styleUrls: ["./archive.component.css"]
})

export class BlogArchiveComponent extends BlogBaseArchiveComponent implements OnInit {

	public constructor(
		protected session: SessionService,
		protected blogsService: BlogService,
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

	public click(resource: any): void {
		this.router.navigate(['/blog/description/' + resource.id]);
	}

}
