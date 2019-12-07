/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IEmit} from "../../../../../../../types/universe";

import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
	selector: "button-element",
	templateUrl: "./button.component.html",
	styleUrls: ["./button.component.css"],
})

export class ButtonComponent implements OnInit {

	@Input() public description: any;

	@Output() public onClick = new EventEmitter<IEmit>();

	constructor() {
	}

	public ngOnInit() {

	}

	public click(event) {
		this.onClick.emit({source: this.description, value: true, changed: null});
	}

}
