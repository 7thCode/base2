/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BreakpointObserver} from "@angular/cdk/layout";

import {MatSnackBar} from "@angular/material/snack-bar";
import {SessionService} from "../../platform/base/services/session.service";

import {DomSanitizer} from '@angular/platform-browser';
import {BlogsService} from "../../plugins/blog-base/blog-base.service";

import {BlogBaseDescriptionComponent} from "../../plugins/blog-base/blog-base-description/blog-base-description.component";

@Component({
	selector: "blog-description",
	templateUrl: "./description.component.html",
	styleUrls: ["./description.component.css"]
})

export class BlogDescriptionComponent extends BlogBaseDescriptionComponent implements OnInit {

	constructor(
		protected session: SessionService,
		protected blogsService: BlogsService,
		protected breakpointObserver: BreakpointObserver,
		protected domSanitizer: DomSanitizer,
		protected activatedRoute: ActivatedRoute,
		protected snackbar: MatSnackBar,
	) {
		super(session, blogsService, breakpointObserver, domSanitizer, activatedRoute, snackbar);
	}
}
