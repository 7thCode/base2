/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IEmit} from "../../../../../../../types/platform/universe";

import {EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

export class BaseComponent implements OnInit {

	@Input() public description: any;

	@Output() public onChange = new EventEmitter<IEmit>();
	@Output() public onValid = new EventEmitter<IEmit>();

	public value: string = "";
	public present_value: string = "";
	public validators: any = null;

	constructor() {
	}

	public ngOnInit() {
		this.value = this.description.value;  // init
		this.present_value = this.value;
		const validators: any[] = [];
		this.description.validators.forEach((validator) => {
			switch (validator.name) {
				case "required":
					validators.push(Validators.required);
					break;
				case "email":
					validators.push(Validators.email);
					break;
				case "min":
					validators.push(Validators.minLength(validator.value));
					break;
				case "max":
					validators.push(Validators.maxLength(validator.value));
					break;
				case "pattern":
					validators.push(Validators.pattern(validator.value));
					break;
			}
		});
		this.validators = new FormControl("", validators);
	}

	public ngDoCheck() {
		if (this.value !== this.present_value) {
			this.present_value = this.value;
			this.onChange.emit({source: this.description, value: this.value, changed: null});
			this.onValid.emit({source: this.description, value: this.validators, changed: null});
		}
	}
}
