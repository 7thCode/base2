/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {MediaMatcher} from "@angular/cdk/layout";
import {ChangeDetectorRef, OnDestroy, OnInit} from "@angular/core";

import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {MatSnackBar, MatSpinner} from "@angular/material";
import {IErrorObject} from "../../../../../types/universe";
import {SessionService} from "../services/session.service";
import {SessionableComponent} from "./sessionable.component";

/**
 *  * Angilar Material レスポンシブクラス
 *
 * @since 0.01
 */
export abstract class ResponsiveComponent extends SessionableComponent implements OnInit, OnDestroy {

	protected spinnerRef: OverlayRef = this.cdkSpinnerCreate();
	protected mobileQueryListener: () => void;
	public mobileQuery: MediaQueryList;

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

	/**
	 * @returns none
	 */
	public ngOnInit(): void {

	}

	/**
	 * @returns none
	 */
	public ngOnDestroy(): void {
		this.mobileQuery.removeListener(this.mobileQueryListener);
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

	protected errorBar(error: IErrorObject): void {
	 	this.snackbar.open(error.message, "Close", {
	 		duration: 3000,
	 	});
	 }

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
}
