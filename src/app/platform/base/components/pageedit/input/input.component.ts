/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

@Component({
	selector: "input-element",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.css"],
})

/**
 * インプット
 *
 * @since 0.01
 */
export class InputComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
