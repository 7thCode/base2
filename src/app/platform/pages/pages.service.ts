/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

import {ConstService} from "../base/services/const.service";
import {UpdatableService} from "../base/services/updatable.service";

@Injectable({
	providedIn: "root",
})

export class PagesService extends UpdatableService {

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService, "pages");
	}

	protected decorator(value: any): any {
		return value;
	}

}
