/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {BreakpointObserver} from "@angular/cdk/layout";
import {Overlay} from "@angular/cdk/overlay";
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, VERSION} from "@angular/core";

import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BlogBaseComponent} from "../plugins/blog-base/blog-base.component";
import {SessionService} from "../platform/base/services/session.service";

import {fadeAnimation} from "../platform/base/library/fade-animation";
import {RouterOutlet} from "@angular/router";
import {IErrorObject} from "../../../types/platform/universe";

/**
 * プラットフォーム
 *
 * @since 0.01
 */
@Component({
	selector: "blog-root",
	templateUrl: "./blog.component.html",
	styleUrls: ["./blog.component.css"],
	animations: [fadeAnimation], // register the animation,
})
export class BlogComponent extends BlogBaseComponent implements OnInit, OnDestroy {

	/**
	 *
	 * @param session
	 * @param accountService
	 * @param change
	 * @param overlay
	 * @param snackbar
	 * @param elementRef
	 * @param matDialog
	 * @param breakpointObserver
	 */
	constructor(
		protected session: SessionService,
		protected breakpointObserver: BreakpointObserver,
		protected overlay: Overlay,
		protected change: ChangeDetectorRef,
		protected elementRef: ElementRef,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, breakpointObserver, overlay, change, elementRef, matDialog, snackbar);
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		this.isTablet.subscribe((layoutDetector: any) => {
			if (layoutDetector.matches) {
				this.device = "desktop";
			}
		});
	}

	/**
	 *
	 */
	public prepareRoute(outlet: RouterOutlet): any {
		return (outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
	}

}
