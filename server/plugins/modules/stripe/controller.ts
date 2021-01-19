/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";
import {Callback, IErrorObject} from "../../../../types/platform/universe";

const _: any = require("lodash");

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
	customer: string,
	capture: boolean
}

export class Stripe extends Mail {

	private stripe: any;
	private enable: boolean = false;

	private message: any;
	private module_config: any;

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
			this.module_config = config.systems.modules.stripe;
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
					callback({code: -2, message: "unknown error. 5977"}, {});
				}
			});
		} catch (error) {
			callback({code: -3, message: "unknown error. 7713"}, {});
		}
	}

	/**
	 * アカウントゲット
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	private get_self(operator: IAccountModel, callback: Callback<any>): void {
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
	private put_self(operator: IAccountModel, update: object, callback: Callback<IAccountModel>): void {
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
	public put_id(response: any, operator: any, customer_id: string, callback: (customer_id: string) => void) {
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

							const update = {
								email: customer_email,
								description: operator.user_id,
								address: {  // The customer’s address.
									city: "XX市", // City, district, suburb, town, or village.
									country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
									line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
									line2: "1-1", // Address line 2 (e.g., apartment, suite, unit, or building).
									postal_code: "100-0001", // ZIP or postal code.
									state: "XX県" // State, county, province, or region.
								},
								metadata: {order_id: '6735'}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
								name: "XXXX",  // The customer’s full name or business name.
								phone: "", // The customer’s phone number.
								shipping: { // Mailing and shipping address for the customer. Appears on invoices emailed to this customer.
									address: {
										city: "XX市", // City, district, suburb, town, or village.
										country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
										line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
										line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
										postal_code: "100-0001", // ZIP or postal code.
										state: "XX県" // State, county, province, or region.
									},
									name: "山田", // Customer name.
									phone: "", // Customer phone (including extension).
								}
							}

							this.stripe.customers.create(
								update
							).then((customer: any) => {
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
					this.SendError(response, {code: -1, message: "not logged in."});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 *
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	public payable(operator: any, callback: Callback<boolean>): void {
		this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
			if (!error) {
				if (customer) {
					callback(null, Boolean(customer.default_source)); // no card.
				} else {
					callback(null, false); // not payment customer.
				}
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	public operatorToCustomer(operator: any, callback: Callback<IAccountModel>): void {
		try {
			LocalAccount.default_find_by_id_promise(operator, operator.user_id).then((account: IAccountModel): void => {
				if (account.content.stripe_id) {
					this.stripe.customers.retrieve(account.content.stripe_id).then((customer: any) => {
						callback(null, customer);
					}).catch((error: any) => {
						callback(error, null);
					});
				} else {
					callback(null, null);
				}
			}).catch((error: IErrorObject) => {
				callback(error, null);
			});
		} catch (error) {
			callback(error, null);
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
	public isCustomer(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, {code: -1, message: "not logged in."}, request.user, () => {
				if (this.enable) {

					const operator: IAccountModel = this.Transform(request.user);
					this.get_id(response, operator, (customer_id: string) => {
						this.SendSuccess(response, Boolean(customer_id));
					});

				} else {
					this.SendError(response, {code: -1, message: "disabled."});
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
							this.SendSuccess(response, null);  // no customer
						}
					});
				} else {
					this.SendError(response, {code: -1, message: "not logged in."});
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
							this.SendError(response, {code: 1, message: "no customer. 2"});
						}
					})
				} else {
					this.SendError(response, {code: -1, message: "not logged in."});
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
							this.SendError(response, {code: 1, message: "no customer. 3"});
						}
					})
				} else {
					this.SendError(response, {code: -1, message: "disabled."});
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
								if (customer_id) {

									/*
									const customer_email = operator.username;
									const update = {
										email: 		operator.username,
										description: operator.user_id,
										address: {  // The customer’s address.
											city: "XX市", // City, district, suburb, town, or village.
											country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
											line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
											line2: "1-1", // Address line 2 (e.g., apartment, suite, unit, or building).
											postal_code: "100-0001", // ZIP or postal code.
											state: "XX県" // State, county, province, or region.
										},
										metadata: {order_id: '6735'}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
										name: "XXXX",  // The customer’s full name or business name.
										phone: "", // The customer’s phone number.
										shipping: { // Mailing and shipping address for the customer. Appears on invoices emailed to this customer.
											address: {
												city: "XX市", // City, district, suburb, town, or village.
												country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
												line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
												line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
												postal_code: "100-0001", // ZIP or postal code.
												state: "XX県" // State, county, province, or region.
											},
											name: "山田", // Customer name.
											phone: "", // Customer phone (including extension).
										}
									}
									this.stripe.customers.create(update).then((customer: any) => {
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
									*/
									const customer_email = operator.username;
									this.stripe.tokens.create({card: card}).then((token: any) => {
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
								} else {
									this.SendError(response, {code: 1, message: "no customer. 4"});
								}
							});
						});
					});
				} else {
					this.SendError(response, {code: -1, message: "disabled."});
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
							this.SendError(response, {code: 1, message: "no customer. 5"});
						}
					})
				} else {
					this.SendError(response, {code: -1, message: "disabled."});
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
							this.SendError(response, {code: 1, message: "no customer. 6"});
						}
					})
				} else {
					this.SendError(response, {code: -1, message: "disabled."});
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
							this.SendError(response, {code: 1, message: "no customer. 7"});
						}
					})
				} else {
					this.SendError(response, {code: -1, message: "disabled."});
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 */
	public sendReceipt(mailto: { address: string, charge: any, customer: any }, callback: Callback<any>): void {
		const card = mailto.charge.payment_method_details.card;
		const mail_object = this.module_config.receiptmail;
		mail_object.html.content.text = mail_object.text.content.text = [
			`amount: ¥${mailto.charge.amount}`,
			`status: ${mailto.charge.outcome.seller_message}`,
			`card: ${card.brand}`,
			`last4: ${card.last4}`,
			`expired: ${card.exp_month}/${card.exp_year}`,
			`description: ${mailto.charge.description}`,
			`${JSON.stringify(mailto.customer.shipping)}`
		]

		this.sendMail({
			address: mailto.address,
			bcc: this.bcc,
			title: "Recept",
			template_url: "views/plugins/stripe/mail/mail_template.pug",
			source_object: mail_object,
			link: mailto.charge.receipt_url,
			result_object: {code: 0, message: ["Prease Wait.", ""]},
		}, (error: IErrorObject, result: any) => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * チャージ
	 * @param request
	 * @param charge
	 * @param callback
	 * @returns none
	 */
	public charge(request: any, charge: { customer: string, amount: number, currency: string, description: string, capture: boolean }, callback: Callback<any>): void {
		try {
			if (request.user) {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_self(operator, (error, account) => {
						if (!error) {
							const customer_id = account.content.stripe_id;
							if (customer_id) {
								this.stripe.customers.retrieve(customer_id).then((customer: any) => {
									charge.customer = customer_id;
									this.stripe.charges.create(charge).then((charge: any) => {
										if (charge.payment_method_details.card) {

											// 			this.stripe.issuing.authorizations.list({}).then((charges: any) => {
											// 				console.log(charges);
											// 			})

											// 			const chargeId: any = charge.id;

											// 			this.stripe.charges.capture(chargeId).then((charges: any) => {
											// 				console.log(charges);
											// 			});

											//  		this.stripe.refunds.create({charge: chargeId}).then((charges: any) => {
											//  			console.log(charges);
											//  		});

											callback(null, {address: customer.email || operator.username, charge: charge, customer: customer});
										} else {
											callback({code: 1000, message: "Stripe error."}, null);
										}
									}).catch((error: any) => {
										callback(error, null);
									})
								}).catch((error: any) => {
									callback(error, null);
								});
							} else {
								callback({code: 1, message: "no customer. 8"}, null);
							}
						} else {
							callback(error, null);
						}
					})
				} else {
					callback({code: -2, message: "disabled."}, null);
				}
			} else {
				callback({code: -1, message: "not logged in."}, null);
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * チャージ
	 * @param request
	 * @param response
	 * @returns none
	 */
	public _charge(request: any, response: IJSONResponse): void {
		this.charge(request, request.body, (error, mailto: any) => {
			if (!error) {
				this.sendReceipt(mailto, (error, mail_result: any) => {
					if (!error) {
						this.SendSuccess(response, mail_result);
					} else {
						this.SendError(response, error);
					}
				})
			} else {
				this.SendError(response, error);
			}
		});
	}

}

module.exports = Stripe;