/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback} from "../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

import {retry} from "rxjs/operators";

import {HttpService} from "../base/services/http.service";

@Injectable({
	providedIn: "root",
})
export class FragmentService extends HttpService {

	constructor(
		public http: HttpClient,
	) {
		super(http);
	}

	public get(user_id: string, path: string, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/pages/get/" + encodeURIComponent(path) + "?u=" + encodeURIComponent(user_id) + "&t=e", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				callback(null, result.value);
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 2059"}, null);
		});
	}

}
