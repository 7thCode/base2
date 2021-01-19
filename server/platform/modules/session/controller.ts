/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";

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
			if (request.user) {
				this.SendSuccess(response, this.Transform(request.user));
			} else {
				this.SendInfo(response, {code: 1, message: "not logged in."});
			}
		} catch (error) {
			this.SendError(response, error);
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
				this.SendError(response, {code: -1, message: "not logged in. 7352"});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}
}

module.exports = Session;
