/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

import { environment } from '../../../environments/environment';

import {PublicKeyService} from "../base/services/publickey.service";
import {SecureUpdatableService} from "../base/services/secure_updatable.service";

@Injectable({
	providedIn: "root",
})

export class VaultsService extends SecureUpdatableService {

	constructor(
		public http: HttpClient,
		public PublicKey: PublicKeyService,
	) {
		super(http, "vaults", PublicKey);
	}

	/**
	 * @returns none
	 */
	protected decorator(value: any): any {
		return value;
	}

}
