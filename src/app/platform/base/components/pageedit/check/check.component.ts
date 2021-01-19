/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

/**
 * チェックボックス
 *
 * @since 0.01
 */
@Component({
	selector: "check-element",
	templateUrl: "./check.component.html",
	styleUrls: ["./check.component.css"],
})
export class CheckComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
