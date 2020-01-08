/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";
import {Callback} from "../../../../types/platform/universe";
import {ConstService} from "../../config/const.service";
import {UpdatableService} from "../../platform/base/services/updatable.service";

@Injectable({
	providedIn: "root",
})

export class SitesService extends UpdatableService {

	public model: string = "sites";

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService, "sites");
	}

}
