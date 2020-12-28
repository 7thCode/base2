/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, forwardRef, Input} from "@angular/core";
import {AbstractControl, FormControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
	selector: "[validateEquals][formControlName],[validateEquals][formControl],[validateEquals][ngModel]",
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualsValidator), multi: true},
	],
})

/**
 * イコール
 *
 * @since 0.01
 */
export class EqualsValidator implements Validator {

	private subscribe: boolean = false;

	@Input() public validateEquals: FormControl;

	public validate(c: AbstractControl): { [key: string]: any } | null {
		if (!this.subscribe) {
			this.subscribe = true;
			this.validateEquals.valueChanges.subscribe(() => {
				c.updateValueAndValidity();
			});
		}

		const v = c.value;
		if (v !== this.validateEquals.value) {
			return {
				validateEquals: true,
			};
		}
		return null;
	}
}
