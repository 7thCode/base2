/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
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

	public isHandset: any;
	public isTablet: any;
	public isDesktop: any;

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
