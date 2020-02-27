/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../../types/platform/universe";

import {MediaMatcher} from "@angular/cdk/layout";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {ChangeDetectorRef, OnDestroy, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSpinner} from "@angular/material/progress-spinner";

import {SessionableComponent} from "./sessionable.component";

import {SessionService} from "../services/session.service";

/**
 *  * Angilar Material レスポンシブクラス
 *
 * @since 0.01
 */
export abstract class ResponsiveComponent extends SessionableComponent implements OnInit, OnDestroy {

	public mobileQuery: MediaQueryList;

	protected spinnerRef: OverlayRef = this.cdkSpinnerCreate();
	protected mobileQueryListener: () => void;

	/**
	 *
	 * @param session
	 * @param change
	 * @param overlay
	 * @param snackbar
	 * @param media
	 */
	protected constructor(
		protected session: SessionService,
		protected change: ChangeDetectorRef,
		protected overlay: Overlay,
		protected snackbar: MatSnackBar,
		protected media: MediaMatcher,
	) {
		super(session, change);
		this.mobileQuery = media.matchMedia("(max-width: 600px)");
		this.mobileQueryListener = () => change.detectChanges();
		this.mobileQuery.addListener(this.mobileQueryListener);
	}

	protected cdkSpinnerCreate(): OverlayRef {
		return this.overlay.create({
			hasBackdrop: true,
			backdropClass: "dark-backdrop",
			positionStrategy: this.overlay.position()
				.global()
				.centerHorizontally()
				.centerVertically(),
		});
	}

	/**
	 *
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
	 	this.snackbar.open(error.message, "Close", {
	 		duration: 3000,
	 	});
	 }

	/**
	 * 処理中
	 * スピナー
	 * @param value
	 * @constructor
	 */
	protected Progress(value: boolean): void {
		if (value) {
			if (!this.progress) {
				setTimeout(() => this.spinnerRef.attach(new ComponentPortal(MatSpinner)));
				this.progress = true;
			}
		} else {
			if (this.progress) {
				setTimeout(() => this.spinnerRef.detach());
				this.progress = false;
			}
		}
	}

	public ngOnInit(): void {

	}

	/**
	 *
	 */
	public ngOnDestroy(): void {
		this.mobileQuery.removeListener(this.mobileQueryListener);
	}
}
