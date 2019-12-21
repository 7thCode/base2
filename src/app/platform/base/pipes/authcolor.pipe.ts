/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Pipe, PipeTransform} from "@angular/core";
import {AuthLevel} from "../../../../../types/platform/universe";

@Pipe({
	name: "authcolor",
})

/**
 * Authレベルカラー
 *
 * @since 0.01
 */
export class AuthcolorPipe implements PipeTransform {

	public transform(value: any, args?: any): any {
		let result = "#fdfffd";     // public
		if (value < AuthLevel.manager) {
			result = "#e90257";     // system
		} else if (value < AuthLevel.user) {
			result = "#ffe4e8";     // manager
		} else if (value < AuthLevel.public) {
			result = "#d6fffc";     // user
		}
		return result;
	}

}
