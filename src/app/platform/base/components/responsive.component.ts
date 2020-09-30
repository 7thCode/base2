/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../../types/platform/universe";

import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {Directive, OnDestroy, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSpinner} from "@angular/material/progress-spinner";

import {SessionableComponent} from "./sessionable.component";

import {SessionService} from "../services/session.service";

/**
 *  * Angilar Material レスポンシブクラス
 *
 * @since 0.01
 */

@Directive()
export abstract class ResponsiveComponent extends SessionableComponent implements OnInit {

	public isHandset: any;
	public isTablet: any;
	public isDesktop: any;

	// protected spinnerRef: OverlayRef = this.cdkSpinnerCreate();

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param breakpointObserver
	 */
	protected constructor(
		protected session: SessionService,
	// 	protected overlay: Overlay,
		protected breakpointObserver: BreakpointObserver
	) {
		super(session);
	}

	// protected cdkSpinnerCreate(): OverlayRef {
	// 	return this.overlay.create({
	// 		hasBackdrop: true,
	// 		backdropClass: "dark-backdrop",
	// 		positionStrategy: this.overlay.position()
	// 			.global()
	// 			.centerHorizontally()
	// 			.centerVertically(),
	// 	});
	// }

	/**
	 * 処理中
	 * スピナー
	 * @param value
	 * @constructor
	 */
	// protected Progress(value: boolean): void {
	// 	if (value) {
	// 		if (!this.progress) {
	// 			setTimeout(() => this.spinnerRef.attach(new ComponentPortal(MatSpinner)));
	// 			this.progress = true;
	// 		}
	// 	} else {
	// 		if (this.progress) {
	// 			setTimeout(() => this.spinnerRef.detach());
	// 			this.progress = false;
	// 		}
	// 	}
	// }

	public ngOnInit(): void {
		this.isHandset = this.breakpointObserver.observe([
			Breakpoints.HandsetPortrait,
		]);
		this.isTablet = this.breakpointObserver.observe([
			Breakpoints.TabletPortrait,
		]);
		this.isDesktop = this.breakpointObserver.observe([
			Breakpoints.Web,
		]);
	}

}
