/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject, IQueryOption} from "../../../../types/platform/universe";

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
} from "../../../../types/platform/server";

const Wrapper: any = require("./wrapper");

const path: any = require("path");

const project_root: string = process.cwd();
const models: string = path.join(project_root, "models");

const Account: any = require(path.join(models, "platform/accounts/account"));

/**
 *
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
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
	}


	/**
	 *
	 * @param current
	 * @param username
	 * @returns own
	 */
	private own_by_name(current: any, username: string): boolean {
		// マネージャ以上は、自分以外のアカウントを変更できる。
		let readable: boolean = false;
		if (current.role.raw < AuthLevel.user) { // is not manager?
			readable = true;
		} else {
			readable = (current.username === username); // is self?
		}
		return readable;
	}

	/**
	 *
	 * @param current
	 * @param user_id
	 * @returns own
	 */
	private own_by_id(current: any, user_id: string): boolean {
		// マネージャ以上は、自分以外のアカウントを変更できる。
		let readable: boolean = false;
		if (current.role.raw < AuthLevel.user) { // is not manager?
			readable = true;
		} else {
			readable = (current.user_id === user_id); // is self?
		}
		return readable;
	}

	/**
	 *
	 * @param user
	 * @returns role
	 */
	protected role(user: any): object {
		return Account.Role(user);
	}

	/**
	 *
	 * @param user
	 * @returns user
	 */
	protected default_user(user: any): IAccountModel {
		let result: any = user;
		if (!result) {
			result = {
				user_id: this.systemsConfig.default.user_id,
				auth: 1,
			};
		}
		return result;
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
							this.Model.default_find(operator, query, option, (error: IErrorObject, objects: IUpdatableModel[]): void => {
								this.ifSuccess(response, error, (): void => {
									const filtered: any[] = [];
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
					this.Model.default_find(operator, query, {}, (error: IErrorObject, objects: IUpdatableModel[]): void => {
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

	/**
	 *
	 * @param request
	 * @param response
	 */
	protected get(request: IGetByIDRequest, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.Model.default_find_by_id(operator, target.id, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					if (object) {
						this.SendSuccess(response, object.public());
					} else {
						this.SendWarn(response, {code: 1, message: "not found. 8035"});
					}
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
	protected post(request: IPostRequest<object>, response: IJSONResponse): void {
		try {
			const body: object = request.body;
			const operator: IAccountModel = this.Transform(request.user);
			const object: IUpdatableModel = new this.Model();
			object._create(this.default_user(operator), body, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, object.public());
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
			this.Model.update_by_id(operator, target.id, body, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, object.public());
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
	protected delete(request: IDeleteRequest, response: IJSONResponse): void {
		try {
			const target: IDParam = request.params;
			const operator: IAccountModel = this.Transform(request.user);
			this.Model.remove_by_id(operator, target.id, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.SendSuccess(response, {});
				});
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
			this.Model.default_count(this.default_user(null), {}, (error: IErrorObject, count: number) => {
				if (!error) {
					if (count === 0) {
						const promises: object[] = [];
						objects.forEach((object: any): void => {
							promises.push(new Promise((resolve: any, reject: any): void => {
								if (object) {
									const record: IUpdatableModel = new this.Model();
									record._create(this.default_user({
										user_id: object.user_id,
										auth: 1,
									}), object, (error: IErrorObject, object: IUpdatableModel): void => {
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
				} else {
					callback(error, null);
				}
			});
		} else {
			callback({code: -1, message: "config error. 6744"}, null);
		}
	}
}

module.exports = Updatable;
