/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {ChangeDetectorRef, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";

import {SessionService} from "../services/session.service";
import {SessionableComponent} from "./sessionable.component";

/**
 * パラメータ付きクラス
 *
 * @since 0.01
 */
export abstract class ParamsComponent extends SessionableComponent implements OnInit {

	protected constructor(
		protected session: SessionService,
		protected change: ChangeDetectorRef,
		protected route: ActivatedRoute
	) {
		super(session, change);
	}

	/**
	 * @returns none
	 */
	public ngOnInit() {
		this.route.paramMap
			.subscribe((params: ParamMap) => {
			});
	}

}
