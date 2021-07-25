/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel, IJSONResponse} from "../../../../types/platform/server";
import {AuthLevel, Callback, IErrorObject} from "../../../../types/platform/universe";
import {Errors} from "../../../platform/base/library/errors";

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

	private readonly plan_ids: string[] = [];
	private readonly tax_rates: string[] = [];

	private stripe: any;
	private readonly enable: boolean = false;

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
		this.message = this.systemsConfig.message;
		if (this.systemsConfig.modules.stripe) {
			this.module_config = this.systemsConfig.modules.stripe;
			if (this.systemsConfig.modules.stripe.key) {
				// const key = config.plugins.stripe.key;
				const key = this.systemsConfig.modules.stripe.key;
				this.plan_ids = this.systemsConfig.modules.stripe.plan_ids;
				this.tax_rates = this.systemsConfig.modules.stripe.tax_rates;
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
					callback(Errors.generalError(-2, "unknown error.", "S00442"), {});
				}
			});
		} catch (error) {
			callback(Errors.generalError(-3, "unknown error.", "S00443"), {});
		}
	}

	/**
	 * アカウントゲット
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	private get_self(operator: IAccountModel, callback: Callback<IAccountModel>): void {
		LocalAccount.default_find_by_id(operator, operator.user_id).then((account: IAccountModel): void => {
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
		LocalAccount.set_by_id(operator, operator.user_id, update).then((account: IAccountModel): void => {
			callback(null, account);
		}).catch((error: IErrorObject) => {
			callback(error, null);
		})
	}

	/*
	* 同一プランチェック。
	*
	*
	*/
	private has_same_subscriptions(subscriptions_1: any, subscriptions_2: any): any[] {

		const ids = (data: any[]): any[] => {
			const result: any[] = [];
			data.forEach((subscription: any) => {
				const plan_id = subscription.plan.id;
				if (result.indexOf(plan_id) === -1) {
					result.push(plan_id);
				}
			});
			return result;
		}

		const plan_ids_1: any[] = ids(subscriptions_1.data);
		const plan_ids_2: any[] = ids(subscriptions_2.data);

		const plan_ids: any[] = [...plan_ids_1, ...plan_ids_2];

		return plan_ids.filter((value, index, self) => self.indexOf(value) === index && self.lastIndexOf(value) !== index);
	}

	/**
	 *
	 */
	private all_subscriptions(request: any, callback: Callback<any>): void {
		try {
			this.stripe.subscriptions.list({}).then((subscriptions: any[]) => {
				callback(null, subscriptions);
			}).catch((error: any) => {
				callback(error, null);
			});
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 *
	 *
	 * @param operator
	 * @param callback
	 * @returns none
	 *
	 * 送り先あり 1
	 * カードあり 2
	 *
	 *
	 */
	public payable(operator: any, callback: Callback<number>): void {
		this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
			if (!error) {
				if (customer) {
					let result = 0;
					if (customer.shipping.address) {
						result += 1;
					}
					if (customer.default_source) {
						result += 1;
					}
					callback(null, result); // card?.
				} else {
					callback(null, 0); // not payment customer.
				}
			} else {
				callback(error, null);
			}
		});
	}


	/**
	 * @param stripe_id
	 * @returns none
	 */
	public Customer(stripe_id: string): Promise<any> {
		return this.stripe.customers.retrieve(stripe_id);
	}

	/**
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	public operatorToCustomer(operator: any, callback: Callback<IAccountModel>): void {
		try {
			LocalAccount.default_find_by_id(operator, operator.user_id).then((account: IAccountModel): void => {
				const stripe_id = account.content.stripe_id;
				if (stripe_id) {
					this.stripe.customers.retrieve(stripe_id).then((customer: any) => {
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
	 * isCustomer
	 *
	 * Stripe登録済？
	 *
	 * @param request
	 * @param response
	 */
	public isCustomer(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00444"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.operatorToCustomer(operator, (error, customer) => {
						if (!error) {
							this.SendSuccess(response, Boolean(customer));
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00445"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 */
	public createCustomer(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00446"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					const customer = request.body;
					if (customer) {
						this.logger.info('begin createCustomer. ' + customer.email);
						const update = {
							email: customer.email,
							description: "",
							address: customer.address,
							metadata: {order_id: ""}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
							name: customer.name,  // The customer’s full name or business name.
							phone: customer.phone, // The customer’s phone number.
							shipping: customer.shipping
						}
						this.stripe.customers.create(
							update
						).then((customer: any) => {
							this.logger.info('end createCustomer. ' + customer.email);
							this.put_self(operator, {"content.stripe_id": customer.id}, (error, account) => {
								this.ifSuccess(response, error, (): void => {
									this.SendSuccess(response, customer.id);
								});
							})
						}).catch((error: any) => {
							this.SendError(response, error);
						});
					} else {
						this.SendError(response, Errors.generalError(1, "no customer data.", "S00447"));
					}
				} else {
					this.SendError(response, Errors.generalError(-1, "not logged in.", "S00448"));
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
			this.ifExist(response, Errors.generalError(1, "not logged in.", "S00449"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.operatorToCustomer(operator, (error, customer: any) => {
						if (!error) {
							if (customer) {
								const updateable = Stripe.buildCustomer(customer);
								const result_customer = {sources: {data: customer.sources.data, default: customer.default_source, updateable: updateable}};
								this.SendSuccess(response, result_customer);
							} else {
								this.SendError(response, Errors.generalError(1, "no customer.", "S00400"));
							}
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "not logged in.", "S00401"));
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
			this.ifExist(response, Errors.generalError(1, "not logged in.", "S00402"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_self(operator, (error, account: any) => {
						if (!error) {
							const customer_id = account.content.stripe_id;
							if (customer_id) {
								this.stripe.customers.update(customer_id, request.body).then((customer: any) => {
									this.SendSuccess(response, customer);
								}).catch((error: any) => {
									this.SendError(response, error);
								});
							} else {
								this.SendError(response, Errors.generalError(1, "no customer.", "S00403"));
							}
						} else {
							this.SendError(response, error);
						}
					})
				} else {
					this.SendError(response, Errors.generalError(-1, "not logged in.", "S00404"));
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
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00405"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					this.get_self(operator, (error, account: any) => {
						if (!error) {
							const stripe_id = account.content.stripe_id;
							if (stripe_id) {
								this.logger.info('begin deleteCustomer. ' + operator.username);
								this.stripe.customers.del(stripe_id).then((customer: any) => {
									this.logger.info('end deleteCustomer. ' + operator.username);
									this.put_self(operator, {"content.stripe_id": null}, (error, account) => {
										this.ifSuccess(response, error, (): void => {
											this.SendSuccess(response, customer.id);
										});
									})
								}).catch((error: any) => {
									this.SendError(response, error);
								});
							} else {
								this.SendError(response, Errors.generalError(1, "no customer.", "S00406"));
							}
						} else {
							this.SendError(response, error);
						}
					})
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00407"));
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
			this.ifExist(response, Errors.userError(1, "not logged in.", "SZ00408"), request.user, () => {
				if (this.enable) {
					Stripe.value_decrypt(this.systemsConfig.use_publickey, this.systemsConfig.privatekey, request.body.content, (error: IErrorObject, value: any): void => {
						this.ifSuccess(response, error, (): void => {
							const operator: IAccountModel = this.Transform(request.user);
							const card = value.card;// request.body.card; // todo : 暗号化
							this.get_self(operator, (error, account: any) => {
								if (!error) {
									const stripe_id = account.content.stripe_id;
									if (stripe_id) {
										const customer_email = operator.username;
										this.stripe.tokens.create({card: card}).then((token: any) => {
											const params = {
												source: token.id
											};
											this.logger.info('begin createSource. ' + customer_email);
											this.stripe.customers.createSource(stripe_id, params).then((card: any) => {
												this.logger.info('end createSource. ' + customer_email);
												this.SendSuccess(response, stripe_id);
											}).catch((error: any) => {
												this.SendError(response, error);
											})
										}).catch((error: any) => {
											this.SendError(response, error);
										})
									} else {
										this.SendError(response, Errors.generalError(100, "no customer.", "S00409"));
									}
								} else {
									this.SendError(response, error);
								}
							});
						});
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00410"));
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
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00411"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					const index = request.params.index;
					this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
						if (!error) {
							if (customer) {
								const cards = customer.sources.data;
								if (cards.length > index) {
									const target_card = cards[index];
									const card_id = target_card.id;
									this.stripe.customers.retrieveSource(customer.id, card_id).then((card: any) => {
										this.SendSuccess(response, card);
									}).catch((error: any) => {
										this.SendError(response, error);
									})
								} else {
									this.SendError(response, Errors.generalError(-1, "index.", "S00412"));
								}
							} else {
								this.SendError(response, Errors.generalError(1, "no customer.", "S00413"));
							}
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00414"));
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
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00415"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					const index = request.params.index;
					const content = request.body;
					this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
						if (!error) {
							if (customer) {
								const cards = customer.sources.data;
								if (cards.length > index) {
									const target_card = cards[index];
									const card_id = target_card.id;
									this.stripe.customers.updateSource(customer.id, card_id, content).then((card: any) => {
										this.SendSuccess(response, card);
									}).catch((error: any) => {
										this.SendError(response, error);
									})
								} else {
									this.SendError(response, Errors.generalError(-1, "index.", "S00416"));
								}
							} else {
								this.SendError(response, Errors.generalError(1, "no customer.", "S00417"));
							}
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00418"));
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
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00419"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					const card_id = request.params.card_id;
					this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
						if (!error) {
							if (customer) {
								// 	const cards = customer.sources.data;
								// 	const target_card = cards[index];
								// 	const card_id = target_card.id; //  "card_1HI5UDKQOTxsQU5nvs2pnL1y";
								this.stripe.customers.deleteSource(customer.id, card_id).then((card: any) => {
									this.SendSuccess(response, card);
								}).catch((error: any) => {
									this.SendError(response, error);
								})

							} else {
								this.SendError(response, Errors.generalError(1, "no customer.", "S00420"));
							}
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00421"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 */
	public sendBankReceipt(mailto: { address: string, charge: any, customer: any }, append: any[], callback: Callback<any>): void {

		// const mail_object = this.module_config.receiptmail;
		const mail_object = JSON.parse(JSON.stringify(this.module_config.receiptmail));

		const formatter = new Intl.NumberFormat('ja-JP');

		mail_object.html.content.text = mail_object.text.content.text = [
			`amount: ¥${formatter.format(mailto.charge.amount)}`,
		];

		append.forEach((line) => {
			mail_object.text.content.text.push(line);
		});

		mail_object.text.content.text.push(`description: ${mailto.charge.description}`);

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
	 */
	public sendDeliveryReceipt(mailto: { address: string, charge: any, customer: any }, append: any[], callback: Callback<any>): void {

		// const mail_object = this.module_config.receiptmail;
		const mail_object = JSON.parse(JSON.stringify(this.module_config.receiptmail));

		const formatter = new Intl.NumberFormat('ja-JP');

		mail_object.html.content.text = mail_object.text.content.text = [
			`amount: ¥${formatter.format(mailto.charge.amount)}`,
		];

		append.forEach((line) => {
			mail_object.text.content.text.push(line);
		});

		mail_object.text.content.text.push(`description: ${mailto.charge.description}`);

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
	 */
	public sendCardReceipt(mailto: { address: string, charge: any, customer: any }, append: any[], callback: Callback<any>): void {
		const card = mailto.charge.payment_method_details.card;
		// const mail_object = this.module_config.receiptmail;
		const mail_object = JSON.parse(JSON.stringify(this.module_config.receiptmail));

		const formatter = new Intl.NumberFormat('ja-JP');

		mail_object.html.content.text = mail_object.text.content.text = [
			`amount: ¥${formatter.format(mailto.charge.amount)}`,
			`-`,
			`card: ${card.brand}`,
			`last4: ${card.last4}`,
			`expired: ${card.exp_month}/${card.exp_year}`,
			`-`,
			`status: ${mailto.charge.outcome.seller_message}`,
		];

		append.forEach((line) => {
			mail_object.text.content.text.push(line);
		});

		mail_object.text.content.text.push(`description: ${mailto.charge.description}`);

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
	public charge(request: any, charge: { customer: string, amount: number, currency: string, description: string, capture: boolean }, callback: Callback<{ address: string, charge: any, customer: any }>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
				if (!error) {
					if (customer) {
						charge.customer = customer.id;
						charge.amount = Math.round(charge.amount); // 四捨五入
						this.stripe.charges.create(charge).then((charge: any) => {
							if (charge.payment_method_details.card) {

								//                      this.stripe.issuing.authorizations.list({}).then((charges: any) => {
								//                              console.log(charges);
								//                      })

								//                      const chargeId: any = charge.id;

								//          チャージをキャプチャする
								//                      this.stripe.charges.capture(chargeId).then((charges: any) => {
								//                              console.log(charges);
								//                      });

								//          払い戻しを作成する
								//              this.stripe.refunds.create({charge: chargeId}).then((charges: any) => {
								//                      console.log(charges);
								//              });

								callback(null, {address: customer.email || operator.username, charge: charge, customer: customer});
							} else {
								callback(Errors.generalError(1000, "Stripe error.", "S00422"), null);
							}
						}).catch((error: any) => {
							callback(error, null);
						})
					} else {
						callback(Errors.generalError(1, "no customer.", "S00423"), null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * 定期課金
	 * @param request
	 * @param subscription
	 * @param callback
	 * @returns none
	 */
	public subscribe(request: any, subscription: any, callback: Callback<any>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
				if (!error) {
					if (customer) {
						this.all_subscriptions(request, (error, all_subscriptions) => { // 同一プランがなければ
							if (!error) {
								const subscriptions = this.has_same_subscriptions(all_subscriptions, customer.subscriptions);
								if (subscriptions.length === 0) {
									const plan_id: string = this.plan_ids[0];
									const sales_tax: string = this.tax_rates[0];
									this.stripe.subscriptions.create({
										customer: customer.id,
										items: [
											{price: plan_id},
										],
										default_tax_rates: [
											sales_tax
										],
									}).then((subscription: any) => {
										if (subscription) {
											callback(null, {});
										} else {
											callback(Errors.generalError(1000, "Stripe error.", "S00424"), null);
										}
									}).catch((error: any) => {
										callback(error, null);
									})
								} else {
									callback(null, {});
								}
							} else {
								callback(error, null);
							}
						});
					} else {
						callback(Errors.generalError(1, "no customer.", "S00425"), null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * 定期課金更新
	 * @param request
	 * @param callback
	 * @returns none
	 */
	public has_subscribe(request: any, callback: Callback<boolean>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			if (operator.auth < AuthLevel.user) {
				callback(null, true);
			} else {
				this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
					if (!error) {
						if (customer) {
							this.all_subscriptions(request, (error, all_subscriptions) => { // 全てのプラン
								if (!error) {
									const result = this.has_same_subscriptions(all_subscriptions, customer.subscriptions);　// 自分のプランは？
									const is_subscribe = (result.length > 0);
									callback(null, is_subscribe);
								} else {
									callback(error, null);
								}
							})
						} else {
							callback(Errors.generalError(1, "no customer.", "S00426"), null);
						}
					} else {
						callback(error, null);
					}
				});
			}
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * 定期課金更新
	 * @param request
	 * @param metadata
	 * @param callback
	 * @returns none
	 */
	public update_subscribe(request: any, metadata: any, callback: Callback<any>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
				if (!error) {
					if (customer) {
						const subscriptions: any[] = customer.subscriptions.data;
						if (subscriptions.length > 0) {
							const promises: any = [];
							subscriptions.forEach((subscription: any): void => {
								const plan_id: string = this.plan_ids[0];
								if (subscription.plan.id === plan_id) {
									promises.push(new Promise((resolve: any, reject: any): void => {
											//		const subscription_id = subscription.id;
											this.stripe.subscriptions.update(subscription.id, {metadata: metadata}).then((subscription: any) => {
												if (subscription) {
													resolve(subscription);
												} else {
													reject({});
												}
											}).catch((error: any) => {
												reject(error);
											});
										}
									));
								}
							});
							Promise.all(promises).then((objects: any): void => {
								callback(null, objects);
							}).catch((error): void => {
								callback(error, null);
							});

						} else {
							callback(Errors.generalError(-1, "no subscription.", "S00427"), null);
						}
					} else {
						callback(Errors.generalError(1, "no customer.", "S00428"), null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * 定期課金解除
	 *
	 * @param request
	 * @param callback
	 * @returns none
	 */
	public cancel_subscribe(request: any, callback: Callback<any>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
				if (!error) {
					if (customer) {
						const subscriptions: any[] = customer.subscriptions.data;
						if (subscriptions.length > 0) {
							const promises: any = [];
							subscriptions.forEach((subscription: any): void => {
								const plan_id: string = this.plan_ids[0];
								if (subscription.plan.id === plan_id) {
									promises.push(new Promise((resolve: any, reject: any): void => {
										//			const subscription_id = subscription.id;
										this.stripe.subscriptions.del(subscription.id).then((subscription: any) => {
											if (subscription) {
												resolve(subscription);
											} else {
												reject({});
											}
										}).catch((error: any) => {
											callback(error, null);
										});
									}));
								}
							});

							Promise.all(promises).then((objects: any): void => {
								callback(null, objects);
							}).catch((error): void => {
								callback(error, null);
							});

						} else {
							callback(Errors.generalError(-1, "no subscription.", "S00429"), null);
						}
					} else {
						callback(Errors.generalError(1, "no customer.", "S00430"), null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * レシート
	 * @param request
	 * @param charge
	 * @param callback
	 * @returns none
	 */
	public receipt(request: any, charge: { customer: string, amount: number, currency: string, description: string, capture: boolean }, callback: Callback<{ address: string, charge: any, customer: any }>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
				if (!error) {
					if (customer) {
						charge.customer = customer.id;
						callback(null, {address: customer.email || operator.username, charge: charge, customer: customer});
					} else {
						callback(Errors.generalError(1, "no customer.", "S00431"), null);
					}
				} else {
					callback(error, null);
				}
			});
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
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00432"), request.user, () => {
				if (this.enable) {
					this.charge(request, request.body, (error, mailto: any) => {
						if (!error) {
							this.sendCardReceipt(mailto, [], (error, mail_result: any) => {
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
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00433"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * 定期
	 *
	 * https://dashboard.stripe.com/test/products/create
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public _subscribe(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00434"), request.user, () => {
				if (this.enable) {
					this.subscribe(request, request.body, (error, subscribe: any) => {
						if (!error) {
							this.SendSuccess(response, subscribe);
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00435"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	public _has_subscribe(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00436"), request.user, () => {
				if (this.enable) {
					this.has_subscribe(request, (error, subscribe: boolean) => {
						if (!error) {
							this.SendSuccess(response, subscribe);
						} else {
							this.SendWarn(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00437"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	public _update_subscribe(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00438"), request.user, () => {
				if (this.enable) {
					this.update_subscribe(request, request.body, (error, subscribe: any) => {
						if (!error) {
							this.SendSuccess(response, subscribe);
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00439"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	public _cancel_subscribe(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00440"), request.user, () => {
				if (this.enable) {
					this.cancel_subscribe(request, (error, subscribe: any) => {
						if (!error) {
							this.SendSuccess(response, subscribe);
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00441"));
				}
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 * charge参照
	 * @param request
	 * @param charge_id
	 * @param callback
	 * @returns none
	 */
	public capture(request: any, charge_id: string, callback: (error: IErrorObject, result: any) => void): void {
		try {
			this.stripe.charges.capture(charge_id).then((card: any) => {
				callback(null, card);
			}).catch((error: any) => {
				callback(error, null);
			})
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * charge参照
	 * @param request
	 * @param charge_id
	 * @param callback
	 * @returns none
	 */
	public refunds(request: any, charge_id: string, callback: (error: IErrorObject, result: any) => void): void {
		try {
			this.stripe.refunds.create(charge_id, (error: IErrorObject, card: any) => {
				callback(null, card);
			}).catch((error: any) => {
				callback(error, null);
			})
		} catch (error) {
			callback(error, null);
		}
	}
}

module.exports = Stripe;
