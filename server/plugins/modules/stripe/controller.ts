/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";
import {Callback, IErrorObject} from "../../../../types/platform/universe";


const _: any = require("lodash");

// import Stripe from 'stripe';

const _Stripe: any = require('stripe')

const Cipher: any = require("../../../platform/base/library/cipher");
const Mail: any = require("../../../platform/base/controllers/mail_controller");
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

export class Stripe extends Mail {

	private stripe: any;
	private enable: boolean = false;

	private message: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
		this.message = config.systems.message;
		if (config.systems.modules.stripe) {
			if (config.systems.modules.stripe.key) {
				// const key = config.plugins.stripe.key;
				const key = config.systems.modules.stripe.key;
				this.stripe = new _Stripe(key, {
					apiVersion: "2020-03-02",
				});
				this.enable = true;
			}
		}
	}

	/**
	 *
	 * @param key
	 * @param crypted
	 * @param callback
	 * @returns none
	 */
	private static publickey_decrypt(key: string, crypted: string, callback: Callback<any>): void {
		try {
			callback(null, Cipher.Decrypt(key, crypted));
		} catch (e) {
			callback(e, "");
		}
	}

	private static buildCustomer(customer: any): any {
		const result = {
			address: {
				country: "",
				postal_code: "",
				state: "",
				city: "",
				line1: "",
				line2: ""
			},
			description: "",
			email: "",
			name: "",
			phone: "",
			shipping: {
				address: {
					country: "",
					postal_code: "",
					state: "",
					city: "",
					line1: "",
					line2: ""
				},
				name: "",
				phone: ""
			}
		};

		if (customer.address) {
			const address = customer.address;
			result.address.country = address.country || "";
			result.address.postal_code = address.postal_code || "";
			result.address.state = address.state || "";
			result.address.city = address.city || "";
			result.address.line1 = address.line1 || "";
			result.address.line2 = address.line2 || "";
		}
		result.description = customer.description || "";
		result.email = customer.email || "";
		result.name = customer.name || "";
		result.phone = customer.phone || "";

		if (customer.shipping) {
			const shipping = customer.shipping;
			if (shipping.address) {
				const address = shipping.address;
				result.shipping.address.country = address.country || "";
				result.shipping.address.postal_code = address.postal_code || "";
				result.shipping.address.state = address.state || "";
				result.shipping.address.city = address.city || "";
				result.shipping.address.line1 = address.line1 || "";
				result.shipping.address.line2 = address.line2 || "";
			}
			result.shipping.name = shipping.name || "";
			result.shipping.phone = shipping.phone || "";
		}
		return result;
	}

	/**
	 *
	 * @param use_publickey
	 * @param key
	 * @param crypted
	 * @param callback
	 * @returns none
	 */
	public static value_decrypt(use_publickey: boolean, key: string, crypted: any, callback: Callback<any>): void {
		try {
			Stripe.publickey_decrypt(key, crypted, (error, plain): void => {
				if (!error) {
					callback(null, JSON.parse(plain));
				} else {
					callback({code: 2, message: "unknown error. 5977"}, {});
				}
			});
		} catch (error) {
			callback({code: 3, message: "unknown error. 7713"}, {});
		}
	}

	/**
	 * アカウントゲット
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	private get_self(operator: IAccountModel, callback: (error: IErrorObject, result: any) => void): void {
		LocalAccount.default_find_by_id_promise(operator, operator.user_id).then((account: IAccountModel): void => {
			callback(null, account);
		}).catch((error: IErrorObject) => {
			callback(error, null);
		});
	}

	/**
	 * アカウントプット
	 * @param operator
	 * @param update
	 * @param callback
	 * @returns none
	 */
	private put_self(operator: IAccountModel, update: object, callback: (error: IErrorObject, result: any) => void): void {
		LocalAccount.set_by_id_promise(operator, operator.user_id, update).then((account: IAccountModel): void => {
			callback(null, account);
		}).catch((error: IErrorObject) => {
			callback(error, null);
		})
	}

	/**
	 *
	 */
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

	/**
	 *
	 */
	public put_id(response: any, operator: any, customer_id: string, callback: (result: string) => void) {
		this.put_self(operator, {"content.stripe_id": customer_id}, (error, account) => {
			this.ifSuccess(response, error, (): void => {
				callback(customer_id);
			});
		})
	}

	/**
	 *
	 */
	public createCustomer(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
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
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {
							this.stripe.customers.retrieve(customer_id).then((full_customer: any) => {
								const updateable = Stripe.buildCustomer(full_customer);
								/*
								{
									address: full_customer.address,
									description: full_customer.description,
									email: full_customer.email,
									metadata: full_customer.metadata,
									name: full_customer.name,
									phone: full_customer.phone,
									shipping: full_customer.shipping
								}
*/
								const result_customer = {sources: {data: full_customer.sources.data, default: full_customer.default_source, updateable: updateable}};
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
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
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
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
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
					this.SendError(response, {code: 1, message: "disabled."});
				}
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
					Stripe.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
						this.ifSuccess(response, error, (): void => {
							const operator: IAccountModel = this.Transform(request.user);
							const card = value.card;// request.body.card; // todo : 暗号化
							this.get_id(response, operator, (customer_id: string) => {
								if (!customer_id) {
									const customer_email = request.body.email;
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
									const customer_email = operator.username;
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
						});
					});
				} else {
					this.SendError(response, {code: 1, message: "disabled."});
				}
			});
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

	public retrieveSource(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
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
					this.SendError(response, {code: 1, message: "disabled."});
				}
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
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
					this.SendError(response, {code: 1, message: "disabled."});
				}
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
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
					this.SendError(response, {code: 1, message: "disabled."});
				}
			});
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
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						if (customer_id) {

							this.stripe.customers.retrieve(customer_id).then((customer: any) => {

								/*
								const resept = {
									"id": "ch_1HLM4PKQOTxsQU5nIdOIiAzL",
									"object": "charge",
									"amount": 100,
									"amount_refunded": 0,
									"application": null,
									"application_fee": null,
									"application_fee_amount": null,
									"balance_transaction": "txn_1HLM4QKQOTxsQU5ntsATZWce",
									"billing_details": {
										"address": {
											"city": null,
											"country": null,
											"line1": null,
											"line2": null,
											"postal_code": null,
											"state": null
										},
										"email": null,
										"name": null,
										"phone": null
									},
									"calculated_statement_descriptor": "Stripe",
									"captured": true,
									"created": 1598676821,
									"currency": "jpy",
									"customer": "cus_Hu792A3BKGiJ6a",
									"description": "HOGE",
									"destination": null,
									"dispute": null,
									"disputed": false,
									"failure_code": null,
									"failure_message": null,
									"fraud_details": {},
									"invoice": null,
									"livemode": false,
									"metadata": {},
									"on_behalf_of": null,
									"order": null,
									"outcome": {
										"network_status": "approved_by_network",
										"reason": null,
										"risk_level": "normal",
										"risk_score": 51,
										"seller_message": "Payment complete.",
										"type": "authorized"
									},
									"paid": true,
									"payment_intent": null,
									"payment_method": "card_1HKJWYKQOTxsQU5niG8FIHFC",
									"payment_method_details": {
										"card": {
											"brand": "visa",
											"checks": {
												"address_line1_check": null,
												"address_postal_code_check": null,
												"cvc_check": null
											},
											"country": "US",
											"exp_month": 2,
											"exp_year": 2022,
											"fingerprint": "1Ed8BAGBi3S4kLkH",
											"funding": "credit",
											"installments": null,
											"last4": "4242",
											"network": "visa",
											"three_d_secure": null,
											"wallet": null
										},
										"type": "card"
									},
									"receipt_email": null,
									"receipt_number": null,
									"receipt_url": "https://pay.stripe.com/receipts/acct_1EXzuTKQOTxsQU5n/ch_1HLM4PKQOTxsQU5nIdOIiAzL/rcpt_HvCT7kuMhFtn6u5QJBnuPVFVmaUFV8H",
									"refunded": false,
									"refunds": {
										"object": "list",
										"data": [],
										"has_more": false,
										"total_count": 0,
										"url": "/v1/charges/ch_1HLM4PKQOTxsQU5nIdOIiAzL/refunds"
									},
									"review": null,
									"shipping": null,
									"source": {
										"id": "card_1HKJWYKQOTxsQU5niG8FIHFC",
										"object": "card",
										"address_city": null,
										"address_country": null,
										"address_line1": null,
										"address_line1_check": null,
										"address_line2": null,
										"address_state": null,
										"address_zip": null,
										"address_zip_check": null,
										"brand": "Visa",
										"country": "US",
										"customer": "cus_Hu792A3BKGiJ6a",
										"cvc_check": null,
										"dynamic_last4": null,
										"exp_month": 2,
										"exp_year": 2022,
										"fingerprint": "1Ed8BAGBi3S4kLkH",
										"funding": "credit",
										"last4": "4242",
										"metadata": {},
										"name": null,
										"tokenization_method": null
									},
									"source_transfer": null,
									"statement_descriptor": null,
									"statement_descriptor_suffix": null,
									"status": "succeeded",
									"transfer_data": null,
									"transfer_group": null
								}
								*/
								/*
								const owner_detail = {
									address: customer.address,
									description: customer.description,
									email: customer.email,
									metadata: customer.metadata,
									name: customer.name,
									phone: customer.phone,
									shipping: customer.shipping
								}
								*/

								const charge = request.body;
								charge.customer = customer_id;
								this.stripe.charges.create(request.body).then((charge: any) => {
									if (charge.payment_method_details.card) {
										const card = charge.payment_method_details.card;
										const receipt_mail = {
											header: {
												title: "Recept",
												text: "Recept",
											},
											content: {
												title: "Recept",
												text: [
													`amount: ¥${charge.amount}`,
													`status: ${charge.outcome.seller_message}`,
													`card: ${card.brand}`,
													`last4: ${card.last4}`,
													`expired: ${card.exp_month}/${card.exp_year}`,
													`description: ${charge.description}`,
													`${JSON.stringify(customer.shipping)}`
												],
											},
											button: {
												title: "Recept",
											},
											footer: {
												text: "Copyright © 2020 seventh-code. All rights reserved.",
											},
										};

										// 		const mail_object =	this.message.registmail;

										this.sendMail({
											address: customer.email || operator.username,
											bcc: this.bcc,
											title: "Recept",
											template_url: "views/plugins/stripe/mail/mail_template.pug",
											source_object: receipt_mail,
											link: charge.receipt_url,
											result_object: {code: 0, message: ["Prease Wait.", ""]},
										}, (error: IErrorObject, result: any) => {
											if (!error) {
												this.SendSuccess(response, charge);
											} else {
												this.SendError(response, error);
											}
										});
									} else {
										this.SendError(response, {code: 1000, message: "Stripe error."});
									}
								}).catch((error: any) => {
									this.SendError(response, error);
								})
							}).catch((error: any) => {
								this.SendError(response, error);
							});
						} else {
							this.SendError(response, {code: 1, message: "not."});
						}
					})
				} else {
					this.SendError(response, {code: 1, message: "disabled."});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

}

module.exports = Stripe;
