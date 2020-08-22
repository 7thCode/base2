/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";

const _: any = require("lodash");

const Wrapper: any = require("../../../../server/platform/base/controllers/wrapper");

export class Paypal extends Wrapper {

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);

	}


	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public createCustomer(request: { session: any, body: { email: string } }, response: IJSONResponse): void {

	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public retrieveCustomer(request: { session: any, params: { id: string } }, response: IJSONResponse): void {

	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public updateCustomer(request: { session: any, params: { id: string }, body: { data: object } }, response: IJSONResponse): void {

	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public deleteCustomer(request: { session: any, params: { id: string } }, response: IJSONResponse): void {

	}

	public createToken(request: { session: any, params: { id: string }, body: any }, response: IJSONResponse): void {

	}

	public charge(request: { session: any, body: any}, response: IJSONResponse): void {

	}

}

module.exports = Paypal;
