/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component} from "@angular/core";

import {BaseComponent} from "../base/base.component";

@Component({
	selector: "textarea-element",
	templateUrl: "./textarea.component.html",
	styleUrls: ["./textarea.component.css"],
})

export class TextareaComponent extends BaseComponent {

	/**
	 *
	 */
	constructor() {
		super();
	}

}
