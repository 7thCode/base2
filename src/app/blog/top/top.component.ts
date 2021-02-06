/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatDialog} from "@angular/material/dialog";
import {Overlay} from "@angular/cdk/overlay";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BlogsService} from "../../plugins/blog-base/blog-base.service";

import {BlogBaseTopComponent} from "../../plugins/blog-base/blog-base-top/blog-base-top.component";

@Component({
	selector: "blog-top",
	templateUrl: "./top.component.html",
	styleUrls: ["./top.component.css"]
})

export class BlogTopComponent extends BlogBaseTopComponent implements OnInit {

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param matDialog
	 * @param breakpointObserver
	 * @param blogsService
	 * @param snackbar
	 */
	public constructor(
		protected session: SessionService,
		protected blogsService: BlogsService,
		protected breakpointObserver: BreakpointObserver,
		protected overlay: Overlay,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, blogsService, breakpointObserver, overlay, matDialog, snackbar);
	}
}
