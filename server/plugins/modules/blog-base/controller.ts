/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IArticleModel, IJSONResponse, IQueryParam, IQueryRequest} from "../../../../types/platform/server";
import {IErrorObject, IQueryOption} from "../../../../types/platform/universe";

const Updatable: any = require("../../../platform/base/controllers/updatable_controller");

const Article: any = require("../../../../models/platform/articles/article");

/**
 *
 *
 *
 */
export class Entries extends Updatable {

	protected Model: IArticleModel;

	/**
	 * @param event
	 * @param config
	 * @param logger
	 */
	constructor(event: any, config: object, logger: any) {
		super(event, config, logger);
		this.Model = Article as IArticleModel;
		event.on("compaction", () => {
			logger.info("start compaction Articles");
		});
	}

	private static build_group_by_month_aggrigater(aggregater: any[]): void {
		aggregater.push({
			$group: {
				_id: {
					yyyy: {$year: "$create"},
					mm: {$month: "$create"},
					// 			dd: {$dayOfMonth: "$create"}
				},
				entries: {$push:  "$content"},
				count: {$sum: 1}
			}
		});
	}

	private static build_group_by_type_aggrigater(aggregater: any[]): void {
		aggregater.push({
			$group: {
				_id: {
					type: "$content.type"
				},
				entries: {$push: "$content"},
				count: {$sum: 1}
			}
		});
	}

	/**
	 * @param option
	 * @param aggregater
	 */
	private static option_to_aggregater(aggregater: any[], option: IQueryOption): void {
		if (option.sort) {
			if (Object.keys(option.sort).length > 0) {
				aggregater.push({$sort: option.sort});
			}
		}

		if (option.skip) {
			aggregater.push({$skip: option.skip});
		}

		if (option.limit) {
			aggregater.push({$limit: option.limit});
		}
	}

	public aggrigate(params: any, aggregater: any[], callback: (error: IErrorObject, result: any) => void): void {
		this.Decode(params.query, (error: IErrorObject, query: any): void => {
			if (!error) {
				this.Decode(params.option, (error: IErrorObject, option: IQueryOption): void => {
					if (!error) {

						if (JSON.stringify(query) !== "{}") {
							aggregater.push({$match: query});
						}

						Entries.option_to_aggregater(aggregater, option);	// skip, limit

						Article.aggregate(aggregater).then((entries: any[]): void => {
							callback(null, entries);
						}).catch((error: IErrorObject) => {
							callback(error, null);
						});

					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	public group_by_month(request: IQueryRequest, response: IJSONResponse): void {
		const params: IQueryParam = request.params;
		const aggregater: any = [];
		Entries.build_group_by_month_aggrigater(aggregater);
		this.aggrigate(params, aggregater, (error, entries) => {
			if (!error) {
				entries.forEach((entry: any) => {
					entry.name = String(entry._id.yyyy) + "/" + String(entry._id.mm);
				})
				this.SendSuccess(response, entries);
			} else {
				this.SendError(response, error);
			}
		})
	}

	public group_by_type(request: IQueryRequest, response: IJSONResponse): void {
		const params: IQueryParam = request.params;
		const aggregater: any = [];
		Entries.build_group_by_type_aggrigater(aggregater);
		this.aggrigate(params, aggregater, (error, entries) => {
			if (!error) {
				entries.forEach((entry: any) => {
					entry.name = entry._id.type;
				})
				this.SendSuccess(response, entries);
			} else {
				this.SendError(response, error);
			}
		})
	}


}

module.exports = Entries;
