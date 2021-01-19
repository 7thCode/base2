/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {UpdatableComponent} from "./updatable.component";

import {SessionService} from "../services/session.service";

/**
 * Angilar Material グリッドビュー基本
 *
 * @since 0.01
 */

@Directive()
export abstract class GridViewComponent extends UpdatableComponent implements OnInit {

	public breakpoint: number = 4;

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param matDialog
	 */
	constructor(
		protected session: SessionService,
		protected matDialog: MatDialog,
	) {
		super(session, matDialog);
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
