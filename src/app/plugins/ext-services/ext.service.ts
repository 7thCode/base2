/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Callback} from "../../../../types/platform/universe";
import {retry} from "rxjs/operators";

import {HttpService} from "../../platform/base/services/http.service";

export interface IZipAddress {
	address1: string;
	address2: string;
	address3: string;
	kana1: string;
	kana2: string;
	kana3: string;
	prefcode: string;
	zipcode: string;
}

@Injectable({
	providedIn: "root",
})

export class ExtService extends HttpService {

	/**
	 *
	 * @param http
	 * @param PublicKey
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http);
	}

	/**
	 */
	private wide_to_single(strVal: string): string {

		const halfVal = strVal.replace(/[！-～]/g,
			(tmpStr) => {
				return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
			}
		);

		return halfVal.replace(/”/g, "\"")
			.replace(/’/g, "'")
			.replace(/‘/g, "`")
			.replace(/￥/g, "\\")
			.replace(/　/g, " ")
			.replace(/〜/g, "~");
	}

	/**
	 */
	private normalize_postal(code: string): string {
		let result: string = "";
		for (let index = 0; index < code.length; index++) {
			const char = code.charAt(index);
			if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(char) >= 0) {
				result += char;
			}
		}
		return result;
	}

	/**
	 */
	public zipToAddress(zip: string, callback: Callback<IZipAddress>): void {
		if (zip.length > 3) {
			const clean_zip: string = this.normalize_postal(this.wide_to_single(zip));
			if (clean_zip) {
				this.http.get(this.endPoint + "/ext/zip/address/" + clean_zip, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(result, null);
						}
					} else {
						callback(this.networkError, null);
					}
				}, (error: HttpErrorResponse): void => {
					callback({code: -1, message: error.message + " A8419"}, null);
				});
			} else {
				callback(null, null);
			}
		} else {
			callback(null, null);
		}
	}

}
