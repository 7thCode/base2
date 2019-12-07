/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../types/universe";

import {
	IAccountModel,
	IDParam,
	IGetByIDRequest, IJSONResponse,
	IPostRequest,
	IPutRequest, IQueryParam,
	IQueryRequest, ISecureContent,
	ISecureUpdatableModel,
} from "../../../../types/server";

const Updatable: any = require("./updatable_controller");

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const Cipher: any = require(path.join(library, "cipher"));
const config: any = require(path.join(_config, "default")).systems;

export abstract class SecureUpdatable extends Updatable {

	protected Model: any;
	protected key: string;

	constructor(event: any, key: string) {
		super(event);
		this.key = key;
	}

	private static publickey_decrypt(key: string, crypted: string, callback: Callback<any>): void {
		try {
			callback(null, Cipher.Decrypt(key, crypted));
		} catch (e) {
			callback(e, "");
		}
	}

	public static value_decrypt(key: string, crypted: string, callback: Callback<any>): void {
		SecureUpdatable.publickey_decrypt(key, crypted, (error: IErrorObject, plain: string): void => {
			if (!error) {
				try {
					callback(null, JSON.parse(plain));
				} catch (error) {
					callback(error, {});
				}
			} else {
				callback({code: 2, message: "no cookie?"}, {});
			}
		});
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
							this.Model.default_find(user, query, option, (error: IErrorObject, objects: ISecureUpdatableModel[]): void => {
								this.ifSuccess(response, error, (): void => {
									const filtered = [];
									objects.forEach((object) => {
										filtered.push(object.public(this.key));
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
					this.Model.default_find(user, query, {}, (error: IErrorObject, objects: ISecureUpdatableModel[]): void => {
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
			this.Model.default_find_by_id(user, params.id, (error: IErrorObject, object: ISecureUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					if (object) {
						this.SendSuccess(response, object.public(this.key));
					} else {
						this.SendWarn(response, {code: 2, message: "not found"});
					}
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected post(request: IPostRequest<ISecureContent>, response: IJSONResponse): void {
		try {
			const body: ISecureContent = request.body;
			const user: IAccountModel = this.Transform(request.user);
			SecureUpdatable.value_decrypt(config.privatekey, body.content, (error: IErrorObject, dec: ISecureContent): void => {
				this.ifSuccess(response, error, (): void => {
					body.content = dec.content;
					const object: ISecureUpdatableModel = new this.Model();
					object._create(this.default_user(user), this.key, body, (error: IErrorObject, object: ISecureUpdatableModel): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, object.public(this.key));
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	protected put(request: IPutRequest<ISecureContent>, response: IJSONResponse): void {
		try {
			const params: IDParam = request.params;
			const body: ISecureContent = request.body;
			const user: IAccountModel = this.Transform(request.user);
			SecureUpdatable.value_decrypt(config.privatekey, body.content, (error: IErrorObject, content: object): void => {
				this.ifSuccess(response, error, (): void => {
					this.Model.update_by_id(user, this.key, params.id, content, (error: IErrorObject, object: ISecureUpdatableModel): void => {
						this.ifSuccess(response, error, (): void => {
							this.SendSuccess(response, object.public(this.key));
						});
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

}

module.exports = SecureUpdatable;
