/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";
import {AfterContentInit, ChangeDetectorRef, OnChanges, OnInit, ViewChild} from "@angular/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatGridList} from "@angular/material";

import {SessionService} from "../services/session.service";
import {UpdatableComponent} from "./updatable.component";

/**
 * Angilar Material グリッドビュー基本
 *
 * @since 0.01
 */
export abstract class GridViewComponent extends UpdatableComponent implements OnInit, OnChanges, AfterContentInit {

	@ViewChild("grid", {static: true}) public grid: MatGridList;

	public gridByBreakpoint: object = {xl: 8, lg: 6, md: 4, sm: 2, xs: 1};

	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		protected observableMedia: MediaObserver,
	) {
		super(session, http, change, matDialog);
	}

	/**
	 * @returns none
	 */
	public ngOnChanges(changes): void {

	}

	/**
	 * @returns none
	 */
	public ngAfterContentInit(): void {
		this.observableMedia.media$.subscribe((change: MediaChange) => { // for responsive
			this.grid.cols = this.gridByBreakpoint[change.mqAlias];
		});
	}

}
