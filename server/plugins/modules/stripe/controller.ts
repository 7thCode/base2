/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";
import {IErrorObject} from "../../../../types/platform/universe";

const _: any = require("lodash");

// import Stripe from 'stripe';

const _Stripe: any = require('stripe')

const Wrapper: any = require("../../../../server/platform/base/controllers/wrapper");
const LocalAccount: any = require("../../../../models/platform/accounts/account");

interface ICardInit {
	card: {
		number: string,
		exp_month: string,
		exp_year: string,
		cvc: string
	}
}

interface ICharge {
	amount: number,
	currency: string,
	description: string,
	customer: string
}

export class Stripe extends Wrapper {

	private stripe: any;
	private enable: boolean = false;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
		if (config.plugins.stripe) {
			const key = config.plugins.stripe;
			this.stripe = new _Stripe(key, {
				apiVersion: "2020-03-02",
			});
			this.enable = true;
		}
	}

	/**
	 * アカウントゲット
	 * @param request
	 * @param response
	 * @returns none
	 */
	private get_self(operator: IAccountModel, callback: (error: IErrorObject, result: any) => void): void {
		LocalAccount.default_find_by_id(operator, operator.user_id, (error: IErrorObject, account: IAccountModel): void => {
			callback(error, account);
		});
	}

	/**
	 * アカウントプット
	 * @param request
	 * @param response
	 * @returns none
	 */
	private put_self(operator: IAccountModel, id: string, callback: (error: IErrorObject, result: any) => void): void {
		const update: any = {
			"content.stripe_id": id,
		};
		LocalAccount.set_by_id(operator, operator.user_id, update, (error: IErrorObject, account: IAccountModel): void => {
			callback(error, account);
		});
	}

	public get_id(response: any, operator: any, callback: (customer_id: string) => void): void {
		this.get_self(operator, (error, account) => {
			this.ifSuccess(response, error, (): void => {
				if (account.content.stripe_id) {
					callback(account.content.stripe_id);
				} else {
					callback(null);
				}
			});
		})
	}

	public put_id(response: any, operator: any, customer_id: string, callback: (result: string) => void) {
		this.put_self(operator, customer_id, (error, account) => {
			this.ifSuccess(response, error, (): void => {
				callback(customer_id);
			});
		})
	}

	public createCustomer(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					const customer_email = request.body.email;
					this.get_id(response, operator, (customer_id: string) => {
						if (!customer_id) {
							this.logger.info('begin createCustomer. ' + customer_email);
							this.stripe.customers.create({
								email: customer_email,
								description: operator.user_id,
							}).then((customer: any) => {
								this.logger.info('end createCustomer. ' + customer_email);
								this.put_id(response, operator, customer.id, (customer_id: string) => {
									this.SendSuccess(response, customer_id);
								});
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "already. "});
						}
					});
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public retrieveCustomer(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.stripe.customers.retrieve(customer_id).then((full_customer: any) => {
								const result_customer = {sources: {data: full_customer.sources.data}};
								this.SendSuccess(response, result_customer);
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					});
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public updateCustomer(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.stripe.customers.update(customer_id, request.body).then((customer: any) => {
								this.SendSuccess(response, customer);
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public deleteCustomer(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.logger.info('begin deleteCustomer. ' + operator.username);
							this.stripe.customers.del(customer_id).then((customer: any) => {
								this.logger.info('end deleteCustomer. ' + operator.username);
								this.put_id(response, operator, null, (customer_id: string) => {
									this.SendSuccess(response, customer_id);
								});
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * create card
	 * もしoperatorにcustomer_idが存在しないならcustomerを作成してcardを作成。
	 * tokensは本来clientで作成するべきだが、stripe.tokens.createの仕様が糞っぽい（HTML Element直接渡す、とか臭い)ので、別途暗号化する。
	 *
	 * @param request
	 * @param response
	 */
	public createSource(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					const customer_email = request.body.email;
					const card = request.body.card; // todo : 暗号化
					this.get_id(response, operator, (customer_id: string) => {
						if (!customer_id) {
							this.logger.info('begin createCustomer. ' + customer_email);
							this.stripe.customers.create({
								email: customer_email,
								description: operator.user_id,
							}).then((customer: any) => {
								this.stripe.tokens.create({
									card: card
								}).then((token: any) => {
									const params = {
										source: token.id
									};
									this.logger.info('begin createSource. ' + customer_email);
									this.stripe.customers.createSource(customer.id, params).then((card: any) => {
										this.logger.info('end createSource. ' + customer_email);
										this.put_id(response, operator, customer.id, (customer_id: string) => {
											this.logger.info('end createSource. ' + customer_email);
											this.SendSuccess(response, customer_id);
										});
									}).catch((error: any) => {
										this.SendError(response, error);
									})
								}).catch((error: any) => {
									this.SendError(response, error);
								});
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.stripe.tokens.create({
								card: card
							}).then((token: any) => {
								const params = {
									source: token.id
								};
								this.logger.info('begin createSource. ' + customer_email);
								this.stripe.customers.createSource(customer_id, params).then((card: any) => {
									this.logger.info('end createSource. ' + customer_email);
									this.SendSuccess(response, customer_id);
								}).catch((error: any) => {
									this.SendError(response, error);
								})
							}).catch((error: any) => {
								this.SendError(response, error);
							})
						}
					});
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * card 登録
	 * @param request
	 * @param response
	 * @returns none
	 */
	/*
	public createSource0(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							const card = request.body.card;
							this.stripe.tokens.create({
								card: card
							}).then((token: any) => {
								const params = {
									source: token.id
								};
								this.stripe.customers.createSource(customer_id, params).then((card: any) => {
									this.SendSuccess(response, card);
								}).catch((error: any) => {
									this.SendError(response, error);
								})
							}).catch((error: any) => {
								this.SendError(response, error);
							})
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}
*/
	/**
	 * card 登録
	 * @param request
	 * @param response
	 * @returns none
	 */

	public retrieveSource(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					const index = request.params.index;
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.stripe.customers.retrieve(customer_id).then((customer: any) => {
								const cards = customer.sources.data;
								if (cards.length > index) {
									const target_card = cards[index];
									const card_id = target_card.id; //  "card_1HI5UDKQOTxsQU5nvs2pnL1y";
									this.stripe.customers.retrieveSource(customer_id, card_id).then((card: any) => {
										this.SendSuccess(response, card);
									}).catch((error: any) => {
										this.SendError(response, error);
									})
								} else {
									this.SendError(response, {code: -1, message: "index."});
								}
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * card 登録
	 * @param request
	 * @param response
	 * @returns none
	 */
	public updateSource(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					const index = request.params.index;
					const content = request.body;
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.stripe.customers.retrieve(customer_id).then((customer: any) => {
								const cards = customer.sources.data;
								if (cards.length > index) {
									const target_card = cards[index];
									const card_id = target_card.id; //  "card_1HI5UDKQOTxsQU5nvs2pnL1y";
									this.stripe.customers.updateSource(customer_id, card_id, content).then((card: any) => {
										this.SendSuccess(response, card);
									}).catch((error: any) => {
										this.SendError(response, error);
									})
								} else {
									this.SendError(response, {code: -1, message: "index."});
								}
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * card 登録
	 * @param request
	 * @param response
	 * @returns none
	 */
	public deleteSource(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					const index = request.params.index;
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.stripe.customers.retrieve(customer_id).then((customer: any) => {
								const cards = customer.sources.data;
								if (cards.length > index) {
									const target_card = cards[index];
									const card_id = target_card.id; //  "card_1HI5UDKQOTxsQU5nvs2pnL1y";
									this.stripe.customers.deleteSource(customer_id, card_id).then((card: any) => {
										this.SendSuccess(response, card);
									}).catch((error: any) => {
										this.SendError(response, error);
									})
								} else {
									this.SendError(response, {code: -1, message: "index."});
								}
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}


	/**
	 * チャージ
	 * @param request
	 * @param response
	 * @returns none
	 */
	public charge(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				if (request.user) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							const charge = request.body;
							charge.customer = customer_id;
							this.stripe.charges.create(request.body).then((charge: any) => {
								this.SendSuccess(response, charge);
							}).catch((error: any) => {
								this.SendError(response, error);
							})
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "not logged in."});
				}
			} else {
				this.SendError(response, {code: 1, message: "disabled."});
			}
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	/*
	public createCard(request: { session: any, body: { data: object } }, response: IJSONResponse): void {
		stripe.tokens.create({
			card: {
				"number": "4242424242424242",
				"exp_month": "12",
				"exp_year": "2020",
				"cvc": "123"
			}
		}, (err: any, token: any) => {
			// asynchronously called
			const params = {
				source: token.id
			};
			stripe.customers.createSource(id, params, (err: any, card: any) => {
				console.log(card);
			});
		});
	}
*/
	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	/*
	public charge(request: { session: any, body: { data: object } }, response: IJSONResponse): void {
		const charge = stripe.charges.create({
			amount: price,
			currency: "jpy",
			description: description,
			customer: customer_id
		})
	}
	*/
}

module.exports = Stripe;
