/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

/**
 * インプット
 *
 * @since 0.01
 */
@Component({
	selector: "input-element",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.css"],
})
export class InputComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
