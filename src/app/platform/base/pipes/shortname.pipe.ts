/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: "shortname",
})

/**
 * ユーザショートネーム
 *
 * @since 0.01
 */
export class ShortnamePipe implements PipeTransform {

	/**
	 *
	 * @param value
	 * @param args
	 */
	public transform(value: any, args?: any): any {
		let result: string = "";
		const names: string[] = value.split(":"); // username is mail
		if (names.length === 2) {
			result = names[1]; // username is mail
		}
		return result;
	}

}
