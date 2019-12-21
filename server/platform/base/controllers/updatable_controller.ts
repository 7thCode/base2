/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../types/universe";

import {
	IAccountModel,
	IDeleteRequest,
	IDParam,
	IGetByIDRequest,
	IJSONResponse,
	IPostRequest,
	IPutRequest,
	IQueryParam,
	IQueryRequest,
	IUpdatableModel,
} from "../../../../types/server";

const Wrapper: any = require("./wrapper");

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const log4js: any = require("log4js");
log4js.configure(path.join(_config, "platform/logs.json"));
const logger: any = log4js.getLogger("request");

const config: any = require(path.join(_config, "default")).systems;
const Account: any = require(path.join(models, "platform/accounts/account"));

export abstract class Updatable extends Wrapper {

	protected Model: any;

	constructor(event) {
		super(event);
	}

	protected role(user): object {
		return Account.Role(user);
	}

	protected default_user(user: any): IAccountModel {
		let result: any = user;
		if (result) {

		} else {
			result = {
				user_id: config.default.user_id,
				auth: 1,
			};
		}
		return result;
	}

	public init(objects: object[], callback: Callback<any>): void {
		if (objects) {
			this.Model.default_count(this.default_user(null), {}, (error: IErrorObject, count: number) => {
				if (!error) {
					if (count === 0) {
						const promises: object[] = [];
						objects.forEach((object: { user_id: string }): void => {
							promises.push(new Promise((resolve: any, reject: any): void => {
								if (object) {
									const record: IUpdatableModel = new this.Model();
									record._create(this.default_user({
										user_id: object.user_id,
										auth: 1
									}), object, (error: IErrorObject, object: IUpdatableModel): void => {
										if (!error) {
											resolve(object);
										} else {
											reject(error);
										}
									});
								} else {
									reject({code: -1, message: "?"});
								}
							}));
						});

						Promise.all(promises).then((objects): void => {
							callback(null, objects);
						}).catch((error): void => {
							logger.fatal(error.message);
							callback(error, null);
						});
					} else {
						callback(null, objects);
					}
				} else {
					callback(error, null);
				}
			});
		} else {
			callback({code: -1, message: "config error"}, null);
		}
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
							const user: IAccountModel = this.Transform(request.user);
							this.Model.default_find(user, query, option, (error: IErrorObject, objects: IUpdatableModel[]): void => {
								this.ifSuccess(response, error, (): void => {
									const filtered = [];
									objects.forEach((object) => {
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

	protected count(request: IQueryRequest, response: IJSONResponse): void {
		try {
			const params: IQueryParam = request.params;
			this.Decode(params.query, (error: IErrorObject, query: object): void => {
				this.ifSuccess(response, error, (): void => {
					const user: IAccountModel = this.Transform(request.user);
					this.Model.default_find(user, query, {}, (error: IErrorObject, objects: IUpdatableModel[]): void => {
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

	protected get(request: IGetByIDRequest, response: IJSONResponse): void {
		try {
			const params: IDParam = request.params;
			const user: IAccountModel = this.Transform(request.user);
			this.Model.default_find_by_id(user, params.id, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					if (object) {
						this.SendSuccess(response, object.public());
					} else {
						this.SendWarn(response, {code: 1, message: "not found"});
					}
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected post(request: IPostRequest<object>, response: IJSONResponse): void {
		try {
			const body: object = request.body;
			const user: IAccountModel = this.Transform(request.user);
			const object: IUpdatableModel = new this.Model();
			object._create(this.default_user(user), body, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, object.public());
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected put(request: IPutRequest<object>, response: IJSONResponse): void {
		try {
			const params: IDParam = request.params;
			const body: object = request.body;
			const user: IAccountModel = this.Transform(request.user);
			this.Model.update_by_id(user, params.id, body, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, object.public());
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected delete(request: IDeleteRequest, response: IJSONResponse): void {
		try {
			const params: IDParam = request.params;
			const user: IAccountModel = this.Transform(request.user);
			this.Model.remove_by_id(user, params.id, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, {});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}
}

module.exports = Updatable;
