/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Pipe, PipeTransform} from "@angular/core";
import {AuthLevel} from "../../../../../types/platform/universe";

@Pipe({
	name: "authis",
})

/**
 * Authレベルカラー
 *
 * @since 0.01
 */
export class AuthisPipe implements PipeTransform {

	/**
	 *
	 * @param auth
	 * @param level
	 */
	public transform(auth: number, level: string): boolean {
		let result:boolean = false;     // public
		switch (level) {
			case "system":
				result = (auth <= AuthLevel.system);
				break;
			case "manager":
				result = (auth <= AuthLevel.manager);
				break;
			case "user":
				result = (auth <= AuthLevel.user);
				break;
			case "public":
				result = (auth <= AuthLevel.public);
				break;
			default:
		}
		return result;
	}

}
