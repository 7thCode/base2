/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel, IArticleModel, IDParam, IGetByIDRequest, IJSONResponse, IQueryParam, IQueryRequest, IUpdatableModel} from "../../../../types/platform/server";
import {IErrorObject, IQueryOption} from "../../../../types/platform/universe";
import {Errors} from "../../../platform/base/library/errors";

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

	/**
	 * build_group_by_month_aggrigater
	 *
	 * @param aggregater
	 */
	private static build_group_by_month_aggrigater(aggregater: any[]): void {

		aggregater.push({$sort: {create: -1}});

		aggregater.push({
			$group: {
				_id: {
					yyyy: {$year: "$create"},
					mm: {$month: "$create"},
					// 			dd: {$dayOfMonth: "$create"}
				},
				entries: {$push: {create: "$create", content: "$content"}},
				count: {$sum: 1}
			}
		});
	}

	/**
	 * build_group_by_type_aggrigater
	 *
	 * @param aggregater
	 */
	private static build_group_by_type_aggrigater(aggregater: any[]): void {

		aggregater.push({$sort: {create: -1}});

		aggregater.push({
			$group: {
				_id: {
					type: "$content.type"
				},
				entries: {$push: {create: "$create", content: "$content"}},
				count: {$sum: 1}
			}
		});
	}

	/**
	 * option_to_aggregater
	 *
	 * @param aggregater
	 * @param option
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

// /**
//  * カウント。
//  * レコードのカウント。
//  *
//  * @param request
//  * @param response
//  */
// public robots(request: IQueryRequest, response: IJSONResponse): void {
// 	response.header('Content-Type', 'text/plain');
// 	response.send("User-agent: *\nSitemap: /sitemap.xml");
// }

	/**
	 * sitemap
	 *
	 * @param request
	 * @param response
	 */
	public sitemap(request: IQueryRequest, response: IJSONResponse): void {
		try {
			response.type('application/xml');
			Article.default_find(null, {}, {}).then((objects: IUpdatableModel[]): void => {
				let sitemap: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
				objects.forEach((object: any) => {
					const product_id: string = object.content.id;
					const modify: string = object.modify.toISOString();
					sitemap += `<url><loc>${this.systemsConfig.protocol}://${this.systemsConfig.domain}/mall/product/${product_id}</loc><priority>1.0</priority><lastmod>${modify}</lastmod></url>`;
				});
				sitemap += "</urlset>";
				response.send(sitemap);
			}).catch((error: IErrorObject) => {
				response.send(error.message);
			})
		} catch (error: any) {
			response.send(error.message);
		}
	}

	/**
	 * sitemap
	 *
	 * @param params
	 * @param aggregater
	 * @param callback
	 */
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

	/**
	 * group_by_month
	 *
	 * @param request
	 * @param response
	 */
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
				this.SendError(response, Errors.Error(error, "S10008"));
			}
		})
	}

	/**
	 * group_by_type
	 *
	 * @param request
	 * @param response
	 */
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
				this.SendError(response, Errors.Error(error, "S10009"));
			}
		})
	}

	/**
	 * get
	 * @param request
	 * @param response
	 */
	public get(request: IGetByIDRequest, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.Model.default_find_by_id(operator, target.id).then((object: IUpdatableModel): void => {
				this.ifExist(response, Errors.generalError(-1, "not found.", "S00000"), object, () => {
					this.SendSuccess(response, object);
				});
			}).catch((error: IErrorObject) => {
				this.SendError(response, Errors.Exception(error, "S10009"));
			})
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S10010"));
		}
	}

	/**
	 * query
	 * @param request
	 * @param response
	 * @returns none
	 */
	public query(request: IQueryRequest, response: IJSONResponse): void {
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
							const operator: IAccountModel = this.Transform(request.user);
							this.Model.default_find(operator, query, option).then((objects: IUpdatableModel[]): void => {
								this.ifExist(response, Errors.generalError(-1, "not found.", "S00000"), objects, () => {
									this.SendRaw(response, objects);
								});
							}).catch((error: IErrorObject) => {
								this.SendError(response, Errors.Exception(error, "S10011"));
							})
						});
					});
				});
			});
		} catch (error: any) {
			this.SendError(response, Errors.Exception(error, "S10012"));
		}
	}

}

module.exports = Entries;
