/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {IDParam, IGetByIDRequest, IJSONResponse, IPublishModel, IQueryParam, IQueryRequest} from "../../../../types/server";
import {Callback, IErrorObject, IQueryOption} from "../../../../types/universe";

const Updatable = require("./updatable_controller");

export abstract class Publishable extends Updatable {

	constructor(event: any) {
		super(event);
	}

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
							this.Model.publish_find(query, option, (error: IErrorObject, objects: IPublishModel[]): void => {
								this.ifSuccess(response, error, (): void => {
									const filtered: object[] = [];
									objects.forEach((object): void => {
										filtered.push(object.public());
									});
									this.SendRaw(response, filtered);
								});
							});
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected publish_count(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					this.Model.publish_find(query, {}, (error: IErrorObject, objects: IPublishModel[]): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, objects.length);
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected publish_get(request: IGetByIDRequest, response: IJSONResponse): void {
		try {
			const params: IDParam = request.params;
			this.Model.publish_find_by_id(params.id, (error: IErrorObject, object: IPublishModel): void => {
				this.ifSuccess(response, error, (): void => {
					if (object) {
						this.SendSuccess(response, object);
					} else {
						this.SendWarn(response, {code: 2, message: "not found"});
					}
				});
			});
		} catch (error) {
			this.SendError(response, error);
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
		} catch (error) {
			this.SendError(response, error);
		}
	}

}

module.exports = Publishable;

// db.funds.aggregate([ { $project:{content:1, "order_by_togo": {$divide: ["$content.value.current", "$content.value.target"]}}},     { $sort : { order_by_togo : 1 } }, { $project:{content:1}}]).pretty()
