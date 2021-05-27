/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

import {IAccountModel, IDeleteRequest, IDParam, IGetByIDRequest, IJSONResponse, IPostRequest, IPutRequest, IQueryParam, IQueryRequest, IUpdatableModel,} from "../../../../types/platform/server";

const Wrapper: any = require("./wrapper");

const mongoose: any = require("mongoose");

/**
 * *　データベースの更新を含むクラスのベース
 */
export abstract class Updatable extends Wrapper {

	/**
	 *
	 */
	protected Model: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 */
	protected constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
	}

	/**
	 * 検索
	 * @param request
	 * @param response
	 * @returns none
	 */
	protected query(request: IQueryRequest, response: IJSONResponse): void {
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
								this.ifExist(response, {code: -1, message: "not found. 3733"}, objects, () => {
									const filtered: any[] = [];
									objects.forEach((object) => {
										filtered.push(object.public());
									});
									this.SendRaw(response, filtered);
								});
							}).catch((error: IErrorObject) => {
								this.SendError(response, error);
							})
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	protected count(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					const operator: IAccountModel = this.Transform(request.user);
					this.Model.default_find(operator, query, {}).then((objects: IUpdatableModel[]): void => {
						this.ifExist(response, {code: -1, message: "not found. 3208"}, objects, () => {
							this.SendSuccess(response, objects.length);
						});
					}).catch((error: IErrorObject) => {
						this.SendError(response, error);
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	protected get(request: IGetByIDRequest, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.Model.default_find_by_id(operator, target.id).then((object: IUpdatableModel): void => {
				this.ifExist(response, {code: -1, message: "not found. 5666"}, object, () => {
					this.SendSuccess(response, object.public());
				});
			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			})
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	protected post(request: IPostRequest<object>, response: IJSONResponse): void {
		try {
			const body: object = request.body;
			const operator: IAccountModel = this.Transform(request.user);
			const object: IUpdatableModel = new this.Model();
			object._create(operator, body, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.ifExist(response, {code: -1, message: "not found. 5943"}, object, () => {
						this.SendSuccess(response, object.public());
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	protected put(request: IPutRequest<object>, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			const body: object = request.body;
			const operator: IAccountModel = this.Transform(request.user);
			this.Model.update_by_id(operator, target.id, body).then((object: IUpdatableModel): void => {
				this.ifExist(response, {code: -1, message: "not found.(Unauthorized). 2283"}, object, () => {
					this.SendSuccess(response, object.public());
				});
			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			})
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	protected delete(request: IDeleteRequest, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.Model.remove_by_id(operator, target.id).then((object: IUpdatableModel): void => {
				this.SendSuccess(response, {});
			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param objects
	 * @param callback
	 */
	public init(objects: object[], callback: Callback<any>): void {
		if (objects) {
			this.Model.default_count(null, {}).then((count: number) => {
				if (count === 0) {
					const promises: object[] = [];
					objects.forEach((object: any): void => {
						promises.push(new Promise((resolve: any, reject: any): void => {
							if (object) {
								const user_id: any = new mongoose.Types.ObjectId();
								const user: IAccountModel = this.Transform({
									provider: "local",
									user_id: user_id,
									username: object.username,
									auth: 1,
								});
								const record: IUpdatableModel = new this.Model();
								record._create(user, object, (error: IErrorObject, object: IUpdatableModel): void => {
									if (!error) {
										resolve(object);
									} else {
										reject(error);
									}
								});
							} else {
								reject({code: -1, message: "? 2303"});
							}
						}));
					});

					Promise.all(promises).then((objects): void => {
						callback(null, objects);
					}).catch((error): void => {
						this.logger.fatal(error.message);
						callback(error, null);
					});
				} else {
					callback(null, objects);
				}

			}).catch((error: IErrorObject) => {
				callback(error, null);
			})
		} else {
			callback({code: -1, message: "config error. 6744"}, null);
		}
	}
}

module.exports = Updatable;
