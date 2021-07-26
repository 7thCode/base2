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
	 *
	 *
	 *
	 * @param request
	 * @param response
	 * @returns none
	 *
	 */
	public get(request: { user: any }, response: IJSONResponse): void {
		try {
			this.SendSuccess(response, this.Transform(request.user));

// 			if (request.user) {
// 				this.SendSuccess(response, this.Transform(request.user));
// 			} else {
//  		    this.SendWarn(response, Errors.userError(1, "not logged in.", "S00373"));
// 			}
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00374"));
		}
	}

	/**
	 *
	 *
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public put(request: { session: any, body: { data: object } }, response: IJSONResponse): void {
		try {
			const user: { data: object } = request.session.req.user;
			if (user) {
				if (!user.data) {
					user.data = {};
				}
				user.data = _.merge(user.data, request.body.data);
				request.session.save();
				this.SendSuccess(response, user);
			} else {
				this.SendError(response, Errors.userError(1, "not logged in.", "S00375"));
			}
		} catch (error) {
			this.SendError(response, Errors.Exception(error, "S00376"));
		}
	}
}

module.exports = Session;
