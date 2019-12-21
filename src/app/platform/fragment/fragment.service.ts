/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

import {retry} from "rxjs/operators";
import {Callback} from "../../../../types/universe";
import {ConstService} from "../base/services/const.service";
import {HttpService} from "../base/services/http.service";

@Injectable({
	providedIn: "root",
})

export class FragmentService extends HttpService {

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService);
	}

	public get( user_id: string, path: string, callback: Callback<any>): void {
		this.http.get(this.endPoint + "/pages/get/"  + encodeURIComponent(path) + "?u=" + encodeURIComponent(user_id) + "&t=e", this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				callback(null, result.value);
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

}
