/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {UpdatableComponent} from "./updatable.component";

import {SessionService} from "../services/session.service";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {MatSpinner} from "@angular/material/progress-spinner";

/**
 * Angilar Material グリッドビュー基本
 *
 * @since 0.01
 */

@Directive()
export abstract class GridViewComponent extends UpdatableComponent implements OnInit {

	public breakpoint: number = 4;

	protected spinnerRef: OverlayRef = this.cdkSpinnerCreate();

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param matDialog
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		protected matDialog: MatDialog,
	) {
		super(session, matDialog);
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

	/*
	* width to grid columns
	*  @returns columns
 	*/
	protected widthToColumns(width: number): number {
		let result: number = 4;
		if (width < 600) {
			result = 1;  // xs,
		} else if (width < 960) {
			result = 2;  // sm,
		} else if (width < 1280) {
			result = 4;  // md,
		} else if (width < 1920) {
			result = 6; // lg,
		} else {
			result = 8; // xl,
		}
		return result;
	}

	/*
	*  @returns none
	 */
	public ngOnInit(): void {
		this.breakpoint = this.widthToColumns(window.innerWidth);
		super.ngOnInit();
	}

	/*
	*  @returns none
 	*/
	public onResize(event: any): void {
		this.breakpoint = this.widthToColumns(event.target.innerWidth);
	}

}
