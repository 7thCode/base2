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
import {Overlay} from "@angular/cdk/overlay";
import {MatDialog} from "@angular/material/dialog";

@Component({
	selector: "blog-description",
	templateUrl: "./description.component.html",
	styleUrls: ["./description.component.css"]
})

export class BlogDescriptionComponent extends BlogBaseDescriptionComponent implements OnInit {

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

	/**/
	// public ngOnInit(): void {
	// 	super.ngOnInit();
	// }

}
