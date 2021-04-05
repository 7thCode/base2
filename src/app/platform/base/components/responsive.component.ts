/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Directive, OnInit} from "@angular/core";

import {SessionableComponent} from "./sessionable.component";

import {SessionService} from "../services/session.service";

/**
 *  * Angilar Material レスポンシブクラス
 *
 * @since 0.01
 */

@Directive()
export abstract class ResponsiveComponent extends SessionableComponent implements OnInit {

	public isXSmall: any;
	public isSmall: any;
	public isMedium: any;
	public isLarge: any;
	public isXLarge: any;
	public isHandset: any;
	public isTablet: any;
	public isWeb: any;
	public isHandsetPortrait: any;
	public isTabletPortrait: any;
	public isWebPortrait: any;
	public isHandsetLandscape: any;
	public isTabletLandscape: any;
	public isWebLandscape: any;

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param breakpointObserver
	 */
	protected constructor(
		protected session: SessionService,
		protected breakpointObserver: BreakpointObserver
	) {
		super(session);
	}

	public ngOnInit(): void {

		this.isXSmall = this.breakpointObserver.observe([
			Breakpoints.XSmall,
		]);
		this.isSmall = this.breakpointObserver.observe([
			Breakpoints.Small,
		]);
		this.isMedium = this.breakpointObserver.observe([
			Breakpoints.Medium,
		]);
		this.isLarge = this.breakpointObserver.observe([
			Breakpoints.Large,
		]);
		this.isXLarge = this.breakpointObserver.observe([
			Breakpoints.XLarge,
		]);

		this.isHandset = this.breakpointObserver.observe([
			Breakpoints.Handset,
		]);
		this.isTablet = this.breakpointObserver.observe([
			Breakpoints.Tablet,
		]);
		this.isWeb = this.breakpointObserver.observe([
			Breakpoints.Web,
		]);

		this.isHandsetPortrait = this.breakpointObserver.observe([
			Breakpoints.HandsetPortrait,
		]);
		this.isTabletPortrait = this.breakpointObserver.observe([
			Breakpoints.TabletPortrait,
		]);
		this.isWebPortrait = this.breakpointObserver.observe([
			Breakpoints.WebPortrait,
		]);

		this.isHandsetLandscape = this.breakpointObserver.observe([
			Breakpoints.HandsetLandscape,
		]);
		this.isTabletLandscape = this.breakpointObserver.observe([
			Breakpoints.TabletLandscape,
		]);
		this.isWebLandscape = this.breakpointObserver.observe([
			Breakpoints.WebLandscape,
		]);

	}

}
