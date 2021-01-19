/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {retry} from "rxjs/operators";

import {HttpService} from "../../platform/base/services/http.service";

export interface IZipAddress {
	address1:string;
	address2:string;
	address3:string;
	kana1:string;
	kana2:string;
	kana3:string;
	prefcode:string;
	zipcode:string;
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
	public zipToAddress(zip: string, callback: Callback<IZipAddress>): void {
		if (zip.length > 3) {
			this.http.get(this.endPoint + "/ext/zip/address/" + zip, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
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
				callback({code: -1, message: error.message + " 8419"}, null);
			});
		} else {
			callback({code: -1, message:"zip too short. 2539"}, null);
		}
	}

}
