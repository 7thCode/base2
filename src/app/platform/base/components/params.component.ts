/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";

import {SessionableComponent} from "./sessionable.component";

import {SessionService} from "../services/session.service";

/**
 * パラメータ付きクラス
 *
 * @since 0.01
 */

@Directive()
export abstract class ParamsComponent extends SessionableComponent implements OnInit {

	protected constructor(
		protected session: SessionService,
		protected route: ActivatedRoute,
	) {
		super(session);
	}

	/**
	 * @returns none
	 */
	public ngOnInit(): void {
		this.route.paramMap
			.subscribe((params: ParamMap) => {
			});
	}

}
