/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {IDParam, IGetByIDRequest, IJSONResponse, IPublishModel, IQueryParam, IQueryRequest} from "../../../../types/platform/server";
import {Errors} from "../library/errors";

const Updatable = require("./updatable_controller");

/*
*
* */
export abstract class Publishable extends Updatable {

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	protected constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	protected publish_query(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					this.Decode(params.option, (error: IErrorObject, option: IQueryOption): void => {
						this.ifSuccess(response, error, (): void => {
							if (option.limit) {
								if (option.limit === 0) {
									delete option.limit;
								}
							}
							this.Model.publish_find(query, option).then((objects: IPublishModel[]): void => {
								const filtered: object[] = [];
								objects.forEach((object): void => {
									filtered.push(object.public());
								});
								this.SendRaw(response, filtered);
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S00144"));
							});
						});
					});
				});
			});
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00145"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	protected publish_count(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					this.Model.publish_find(query, {}).then((objects: IPublishModel[]): void => {
						this.SendSuccess(response, objects.length);
					}).catch((error: IErrorObject) => {
						this.SendError(response, Errors.Exception(error, "S00146"));
					});
				});
			});
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00147"));
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	protected publish_get(request: IGetByIDRequest, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			this.Model.publish_find_by_id(target.id).then((object: IPublishModel): void => {
				if (object) {
					this.SendSuccess(response, object);
				} else {
					this.SendError(response, Errors.generalError(2, "not found.", "S00357"));
				}
			}).catch((error: IErrorObject) => {
				this.SendError(response, Errors.Exception(error, "S00358"));
			});
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00359"));
		}
	}

	// :todo 現状は任意のアグリゲーターが実行可能であり、セキュリティホールとなる。
	// :todo 規定されたアグリゲーターを選択して実行する方式に。
	protected publish_aggregate(request: any, response: IJSONResponse): void {
		try {
			const params: any = request.params;
			this.Decode(params.aggregater, (error: IErrorObject, aggregater: any): void => {
				this.ifSuccess(response, error, (): void => {
					this.Model.publish_aggregate(aggregater, (error: IErrorObject, objects: any[]): any => {
						this.ifSuccess(response, error, (): void => {
							this.SendRaw(response, objects);
						});
					});
				});
			});
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S00360"));
		}
	}

}

module.exports = Publishable;
