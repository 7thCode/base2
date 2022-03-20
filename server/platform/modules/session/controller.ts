/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";
import {Errors} from "../../base/library/errors";

const _: any = require("lodash");

const Wrapper: any = require("../../../../server/platform/base/controllers/wrapper");

export class Session extends Wrapper {

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
	 * get
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public get(request: { session: any, body: { data: any } }, response: IJSONResponse): void {
		try {
			const user: { data: object } = this.Transform(request.session.req.user);

			this.SendSuccess(response, user);

// 			if (request.user) {
// 				this.SendSuccess(response, this.Transform(request.user));
// 			} else {
//  		    this.SendWarn(response, Errors.userError(1, "not logged in.", "S00373"));
// 			}
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00374"));
		}
	}

	/**
	 * put
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public put(request: { session: any, body: { data: any } }, response: IJSONResponse): void {
		try {
			const user: { data: object } = this.Transform(request.session.req.user); // request.session.req.user;
			if (user) {

				if (request.session.req.user.data === undefined) {
					request.session.req.user.data = request.body
				} else {
					request.session.req.user.data = _.merge(request.session.req.user.data, request.body);
				}

				// 		request.session.req.user.data = request.body;
				// 		user.data = request.body;
				request.session.save();
				this.SendSuccess(response, request.body);
			} else {
				this.SendError(response, Errors.userError(1, "not logged in.", "S00375"));
			}
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00376"));
		}
	}
}

module.exports = Session;
