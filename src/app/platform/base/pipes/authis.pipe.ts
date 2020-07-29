/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
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
	 * @param value
	 * @param args
	 */
	public transform(role: any, level: string): boolean {
		let result:boolean = false;     // public
		switch (level) {
			case "system":
				result = (role.raw <= AuthLevel.system);
				break;
			case "manager":
				result = (role.raw <= AuthLevel.manager);
				break;
			case "user":
				result = (role.raw <= AuthLevel.user);
				break;
			case "public":
				result = (role.raw <= AuthLevel.public);
				break;
			default:
		}
		return result;
	}

}
