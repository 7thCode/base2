/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: "fixed"
})

export class ToFixedPipe implements PipeTransform {

	transform(value: number, limit: number): string {
		return value.toFixed(limit);
	}

}








