/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IJSONResponse} from "../../../../types/platform/server";

const _: any = require("lodash");
const path: any = require("path");

const project_root: string = process.cwd();
const controllers: string = path.join(project_root, "server/platform/base/controllers");

// import Stripe from 'stripe';

const _Stripe: any = require('stripe')

const Wrapper: any = require(path.join(controllers, "wrapper"));

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

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 * @constructor
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
		this.stripe = new _Stripe("sk_test_YsexgC22DK728hiSHQxJILSC00TymbkYxj", {
			apiVersion: '2020-03-02',
		});
	}


	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public createCustomer(request: { session: any, body: { email: string } }, response: IJSONResponse): void {
		const customer_email = request.body.email;
		this.stripe.customers.create({
			email: customer_email,
			description: 'test customer',
		}).then((customer: any) => {
			this.SendSuccess(response, customer);
		}).catch((error: any) => {
			this.SendError(response, error);
		});
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public retrieveCustomer(request: { session: any, params: { id: string } }, response: IJSONResponse): void {
		const customer_id = request.params.id;
		this.stripe.customers.retrieve(customer_id).then((customer: any) => {
			this.SendSuccess(response, customer);
		}).catch((error: any) => {
			this.SendError(response, error);
		});
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public updateCustomer(request: { session: any, params: { id: string }, body: { data: object } }, response: IJSONResponse): void {
		const customer_id = request.params.id;
		this.stripe.customers.update(customer_id, request.body).then((customer: any) => {
			this.SendSuccess(response, customer);
		}).catch((error: any) => {
			this.SendError(response, error);
		});
	}

	/**
	 * @param request
	 * @param response
	 * @returns none
	 */
	public deleteCustomer(request: { session: any, params: { id: string } }, response: IJSONResponse): void {
		const customer_id = request.params.id;
		this.stripe.customers.delete(customer_id).then((customer: any) => {
			this.SendSuccess(response, customer);
		}).catch((error: any) => {
			this.SendError(response, error);
		});
	}

	public createToken(request: { session: any, params: { id: string }, body: ICardInit }, response: IJSONResponse): void {

		const customer_id = request.params.id;
		const card = request.body.card;

		// const number = card.number;
		// const exp_month = card.exp_month;
		// const exp_year = card.exp_year;
		// const cvc = card.cvc;

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
	}

	public charge(request: { session: any, body: ICharge}, response: IJSONResponse): void {
		this.stripe.charges.create(request.body).then((charge: any) => {
			this.SendSuccess(response, charge);
		}).catch((error: any) => {
			this.SendError(response, error);
		})
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
