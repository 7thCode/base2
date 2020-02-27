/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AfterContentInit, ChangeDetectorRef, OnChanges, OnInit, ViewChild} from "@angular/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {MatDialog} from "@angular/material/dialog";
import {MatGridList} from "@angular/material/grid-list";

import {UpdatableComponent} from "./updatable.component";

import {SessionService} from "../services/session.service";

/**
 * Angilar Material グリッドビュー基本
 *
 * @since 0.01
 */
export abstract class GridViewComponent extends UpdatableComponent implements OnInit, OnChanges, AfterContentInit {

	@ViewChild("grid") public grid: MatGridList;

	public gridByBreakpoint: object = {xl: 8, lg: 6, md: 4, sm: 2, xs: 1};

	/**
	 *
	 * @param session
	 * @param change
	 * @param matDialog
	 * @param observableMedia
	 */
	constructor(
		protected session: SessionService,
		protected change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		protected observableMedia: MediaObserver,
	) {
		super(session, change, matDialog);
	}

	/**
	 *
	 * @param changes
	 */
	public ngOnChanges(changes): void {

	}

	/**
	 *
	 */
	public ngAfterContentInit(): void {
		this.observableMedia.media$.subscribe((change: MediaChange) => { // for responsive
			this.grid.cols = this.gridByBreakpoint[change.mqAlias];
		});
	}

}
