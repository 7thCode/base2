/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

/**
 * セレクト
 *
 * @since 0.01
 */
@Component({
	selector: "select-element",
	templateUrl: "./select.component.html",
	styleUrls: ["./select.component.css"],
})
export class SelectComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
