/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

import { environment } from '../../../environments/environment';

import {UpdatableService} from "../base/services/updatable.service";

@Injectable({
	providedIn: "root",
})

/**
 *
 */
export class PagesService extends UpdatableService {

	/**
	 *
	 * @param http
	 */
	constructor(
		public http: HttpClient,
	) {
		super(http, "pages");
	}

	/**
	 *
	 * @param value
	 */
	protected decorator(value: any): any {
		return value;
	}

}
