/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Pipe, PipeTransform} from "@angular/core";
import {AuthLevel} from "../../../../../types/platform/universe";
// import {AuthLevel} from "../../../../../types/platform/universe";

@Pipe({
	name: "authcolor",
})

/**
 * Authレベルカラー
 *
 * @since 0.01
 */
export class AuthcolorPipe implements PipeTransform {

	/**
	 *
	 * @param value
	 * @param args
	 */
	public transform(value: any, args?: any): string {
		let result:string = "#fdfffd";     // public
		if (value <= AuthLevel.system) {
			result = "#e90257";     // system
		} else if (value <= AuthLevel.manager) {
			result = "#ffe4e8";     // manager
		} else if (value <= AuthLevel.user) {
			result = "#d6fffc";     // user
		}

		return result;
	}

}
