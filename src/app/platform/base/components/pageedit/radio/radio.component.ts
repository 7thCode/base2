/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

/**
 * ラジオ
 *
 * @since 0.01
 */
@Component({
	selector: "radio-element",
	templateUrl: "./radio.component.html",
	styleUrls: ["./radio.component.css"],
})
export class RadioComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
