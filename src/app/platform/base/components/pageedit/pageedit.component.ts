/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {IEmit} from "../../../../../../types/universe";

@Component({
	selector: "page-edit",
	templateUrl: "./pageedit.component.html",
	styleUrls: ["./pageedit.component.css"],
})

export class PageEditComponent implements OnInit {

	@Input() public description: any;

	@Output() public onChange = new EventEmitter<IEmit>();
	@Output() public onClick = new EventEmitter<IEmit>();
	@Output() public onValid = new EventEmitter<IEmit>();

	private changed: any;

	constructor() {
	}

	public ngOnInit() {
		this.clear();
	}

	public clear() {
		this.changed = {};
	}

	public change(event: IEmit): void {
		this.changed[event.source.name] = event.value;
		event.changed = this.changed;
		this.onChange.emit(event);
	}

	public click(event: IEmit): void {
		event.changed = this.changed;
		this.onClick.emit(event);
	}

	public valid(event: IEmit): void {
		event.changed = this.changed;
		this.onValid.emit(event);

		// 	const valid = !event.value.hasError("required");

		// 	console.log(valid);
	}

}
