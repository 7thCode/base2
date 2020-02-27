/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

@Component({
	selector: "select-element",
	templateUrl: "./select.component.html",
	styleUrls: ["./select.component.css"],
})

/**
 * セレクト
 *
 * @since 0.01
 */
export class SelectComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
