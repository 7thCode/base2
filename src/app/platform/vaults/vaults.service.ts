/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

import {ConstService} from "../base/services/const.service";
import {PublicKeyService} from "../base/services/publickey.service";
import {SecureUpdatableService} from "../base/services/secure_updatable.service";

@Injectable({
	providedIn: "root",
})

export class VaultsService extends SecureUpdatableService {

	constructor(
		public http: HttpClient,
		public constService: ConstService,
		public PublicKey: PublicKeyService
	) {
		super(http, constService, "vaults", PublicKey);
	}

	/**
	 * @returns none
	 */
	protected decorator(value: any): any {
		return value;
	}

}
