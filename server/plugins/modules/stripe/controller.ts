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
	 * publickey_decrypt
	 *
	 * @param key
	 * @param crypted
	 * @param callback
	 * @returns none
	 */
	private static publickey_decrypt(key: string, crypted: string, callback: Callback<any>): void {
		try {
			callback(null, Cipher.Decrypt(key, crypted));
		} catch (error: any) {
			callback(error, "");
		}
	}

	/**
	 * buildCustomer
	 *
	 * @param customer
	 * @returns none
	 */
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
	 * value_decrypt
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
		} catch (error: any) {
			callback(Errors.generalError(-3, "unknown error.", "S00443"), {});
		}
	}

	/**
	 * Error message translate
	 *
	 * @param error
	 * @returns string error message
	 */
	private static translationError(error: any): IErrorObject {
		switch (error.code) {
			case "account_country_invalid_address": // The country of the business address provided does not match the country of the account. Businesses must be located in the same country as the account.

				break;
			case "account_invalid": // The account ID provided as a value for the Stripe-Account header is invalid. Check that your requests are specifying a valid account ID.

				break;
			case "account_number_invalid": // The bank account number provided is invalid (e.g., missing digits). Bank account information varies from country to country. We recommend creating validations in your entry forms based on the bank account formats we provide.

				break;
			case "acss_debit_session_incomplete": // The ACSS debit session is not ready to transition to complete status yet. Please try again the request later.

				break;
			case "alipay_upgrade_required": // This method for creating Alipay payments is not supported anymore. Please upgrade your integration to use Sources instead.

				break;
			case "amount_too_large": // The specified amount is greater than the maximum amount allowed. Use a lower amount and try again.

				break;
			case "amount_too_small": // The specified amount is less than the minimum amount allowed. Use a higher amount and try again.

				break;
			case "api_key_expired": // The API key provided has expired. Obtain your current API keys from the Dashboard and update your integration to use them.

				break;
			case "authentication_required": // The payment requires authentication to proceed. If your customer is off session, notify your customer to return to your application and complete the payment. If you provided the error_on_requires_action parameter, then your customer should try another card that does not require authentication.

				break;
			case "balance_insufficient": // The transfer or payout could not be completed because the associated account does not have a sufficient balance available. Create a new transfer or payout using an amount less than or equal to the account’s available balance.

				break;
			case "bank_account_declined": // The bank account provided can not be used to charge, either because it is not verified yet or it is not supported.

				break;
			case "bank_account_exists": // The bank account provided already exists on the specified Customer object. If the bank account should also be attached to a different customer, include the correct customer ID when making the request again.

				break;
			case "bank_account_unusable": // The bank account provided cannot be used for payouts. A different bank account must be used.

				break;
			case "bank_account_unverified": // Your Connect platform is attempting to share an unverified bank account with a connected account.

				break;
			case "bank_account_verification_failed": // The bank account cannot be verified, either because the microdeposit amounts provided do not match the actual amounts, or because verification has failed too many times.

				break;
			case "billing_invalid_mandate": // The Subscription or Invoice attempted payment on a PaymentMethod without an active mandate. In order to create Subscription or Invoice payments with this PaymentMethod, it must be confirmed on-session with a PaymentIntent or SetupIntent first.

				break;
			case "bitcoin_upgrade_required": // This method for creating Bitcoin payments is not supported anymore. Please upgrade your integration to use Sources instead.

				break;
			case "card_decline_rate_limit_exceeded": // This card has been declined too many times. You can try to charge this card again after 24 hours. We suggest reaching out to your customer to make sure they have entered all of their information correctly and that there are no issues with their card.

				break;
			case "card_declined": // The card has been declined. When a card is declined, the error returned also includes the decline_code attribute with the reason why the card was declined. Refer to our decline codes documentation to learn more.

				break;
			case "cardholder_phone_number_required": // You must have a phone_number on file for Issuing Cardholders who will be creating EU cards. You cannot create EU cards without a phone_number on file for the cardholder. See the 3D Secure Documenation for more details.

				break;
			case "charge_already_captured": // The charge you’re attempting to capture has already been captured. Update the request with an uncaptured charge ID.

				break;
			case "charge_already_refunded": // The charge you’re attempting to refund has already been refunded. Update the request to use the ID of a charge that has not been refunded.

				break;
			case "charge_disputed": // The charge you’re attempting to refund has been charged back. Check the disputes documentation to learn how to respond to the dispute.

				break;
			case "charge_exceeds_source_limit": // This charge would cause you to exceed your rolling-window processing limit for this source type. Please retry the charge later, or contact us to request a higher processing limit.

				break;
			case "charge_expired_for_capture": // The charge cannot be captured as the authorization has expired. Auth and capture charges must be captured within seven days.

				break;
			case "charge_invalid_parameter": // One or more provided parameters was not allowed for the given operation on the Charge. Check our API reference or the returned error message to see which values were not correct for that Charge.

				break;
			case "clearing_code_unsupported": // The clearing code provided is not supported.

				break;
			case "country_code_invalid": // The country code provided was invalid.

				break;
			case "country_unsupported": // Your platform attempted to create a custom account in a country that is not yet supported. Make sure that users can only sign up in countries supported by custom accounts.

				break;
			case "coupon_expired": // The coupon provided for a subscription or order has expired. Either create a new coupon, or use an existing one that is valid.

				break;
			case "customer_max_payment_methods": // The maximum number of PaymentMethods for this Customer has been reached. Either detach some PaymentMethods from this Customer or proceed with a different Customer.

				break;
			case "customer_max_subscriptions": // The maximum number of subscriptions for a customer has been reached. Contact us if you are receiving this error.

				break;
			case "email_invalid": // The email address is invalid (e.g., not properly formatted). Check that the email address is properly formatted and only includes allowed characters.

				break;
			case "expired_card": // The card has expired. Check the expiration date or use a different card.

				break;
			case "idempotency_key_in_use": // The idempotency key provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.

				break;
			case "incorrect_address": // The card’s address is incorrect. Check the card’s address or use a different card.

				break;
			case "incorrect_cvc": // The card’s security code is incorrect. Check the card’s security code or use a different card.

				break;
			case "incorrect_number": // The card number is incorrect. Check the card’s number or use a different card.

				break;
			case "incorrect_zip": // The card’s postal code is incorrect. Check the card’s postal code or use a different card.

				break;
			case "instant_payouts_unsupported": // This card is not eligible for Instant Payouts. Try a debit card from a supported bank.

				break;
			case "intent_invalid_state": // Intent is not in the state that is required to perform the operation.

				break;
			case "intent_verification_method_missing": // Intent does not have verification method specified in its PaymentMethodOptions object.

				break;
			case "invalid_card_type": // The card provided as an external account is not supported for payouts. Provide a non-prepaid debit card instead.

				break;
			case "invalid_characters": // This value provided to the field contains characters that are unsupported by the field.

				break;
			case "invalid_charge_amount": // The specified amount is invalid. The charge amount must be a positive integer in the smallest currency unit, and not exceed the minimum or maximum amount.

				break;
			case "invalid_cvc": // The card’s security code is invalid. Check the card’s security code or use a different card.

				break;
			case "invalid_expiry_month": // The card’s expiration month is incorrect. Check the expiration date or use a different card.

				break;
			case "invalid_expiry_year": // The card’s expiration year is incorrect. Check the expiration date or use a different card.

				break;
			case "invalid_number": // The card number is invalid. Check the card details or use a different card.

				break;
			case "invalid_source_usage": // The source cannot be used because it is not in the correct state (e.g., a charge request is trying to use a source with a pending, failed, or consumed source). Check the status of the source you are attempting to use.

				break;
			case "invoice_no_customer_line_items": // An invoice cannot be generated for the specified customer as there are no pending invoice items. Check that the correct customer is being specified or create any necessary invoice items first.

				break;
			case "invoice_no_payment_method_types": // An invoice cannot be finalized because there are no payment method types available to process the payment. Your invoice template settings or the invoice’s payment_settings might be restricting which payment methods are available, or you might need to activate more payment methods in the Dashboard.

				break;
			case "invoice_no_subscription_line_items": // An invoice cannot be generated for the specified subscription as there are no pending invoice items. Check that the correct subscription is being specified or create any necessary invoice items first.

				break;
			case "invoice_not_editable": // The specified invoice can no longer be edited. Instead, consider creating additional invoice items that will be applied to the next invoice. You can either manually generate the next invoice or wait for it to be automatically generated at the end of the billing cycle.

				break;
			case "invoice_payment_intent_requires_action": // This payment requires additional user action before it can be completed successfully. Payment can be completed using the PaymentIntent associated with the invoice. See this page for more details.

				break;
			case "invoice_upcoming_none": // There is no upcoming invoice on the specified customer to preview. Only customers with active subscriptions or pending invoice items have invoices that can be previewed.

				break;
			case "livemode_mismatch": // Test and live mode API keys, requests, and objects are only available within the mode they are in.

				break;
			case "lock_timeout": // This object cannot be accessed right now because another API request or Stripe process is currently accessing it. If you see this error intermittently, retry the request. If you see this error frequently and are making multiple concurrent requests to a single object, make your requests serially or at a lower rate. See the rate limit documentation for more details.

				break;
			case "missing": // Both a customer and source ID have been provided, but the source has not been saved to the customer. To create a charge for a customer with a specified source, you must first save the card details.

				break;
			case "not_allowed_on_standard_account": // Transfers and payouts on behalf of a Standard connected account are not allowed.

				break;
			case "order_creation_failed": // The order could not be created. Check the order details and then try again.

				break;
			case "order_required_settings": // The order could not be processed as it is missing required information. Check the information provided and try again.

				break;
			case "order_status_invalid": // The order cannot be updated because the status provided is either invalid or does not follow the order lifecycle (e.g., an order cannot transition from created to fulfilled without first transitioning to paid).

				break;
			case "order_upstream_timeout": // The request timed out. Try again later.

				break;
			case "out_of_inventory": // The SKU is out of stock. If more stock is available, update the SKU’s inventory quantity and try again.

				break;
			case "parameter_invalid_empty": // One or more required values were not provided. Make sure requests include all required parameters.

				break;
			case "parameter_invalid_integer": // One or more of the parameters requires an integer, but the values provided were a different type. Make sure that only supported values are provided for each attribute. Refer to our API documentation to look up the type of data each attribute supports.

				break;
			case "parameter_invalid_string_blank": // One or more values provided only included whitespace. Check the values in your request and update any that contain only whitespace.

				break;
			case "parameter_invalid_string_empty": // One or more required string values is empty. Make sure that string values contain at least one character.

				break;
			case "parameter_missing": // One or more required values are missing. Check our API documentation to see which values are required to create or modify the specified resource.

				break;
			case "parameter_unknown": // The request contains one or more unexpected parameters. Remove these and try again.

				break;
			case "parameters_exclusive": // Two or more mutually exclusive parameters were provided. Check our API documentation or the returned error message to see which values are permitted when creating or modifying the specified resource.

				break;
			case "payment_intent_action_required": // The provided payment method requires customer actions to complete, but error_on_requires_action was set. If you’d like to add this payment method to your integration, we recommend that you first upgrade your integration to handle actions.

				break;
			case "payment_intent_authentication_failure": // The provided payment method has failed authentication. Provide a new payment method to attempt to fulfill this PaymentIntent again.

				break;
			case "payment_intent_incompatible_payment_method": // The PaymentIntent expected a payment method with different properties than what was provided.

				break;
			case "payment_intent_invalid_parameter": // One or more provided parameters was not allowed for the given operation on the PaymentIntent. Check our API reference or the returned error message to see which values were not correct for that PaymentIntent.

				break;
			case "payment_intent_mandate_invalid": // The provided mandate is invalid and can not be used for the payment intent.

				break;
			case "payment_intent_payment_attempt_expired": // The latest payment attempt for the PaymentIntent has expired. Check the last_payment_error property on the PaymentIntent for more details, and provide a new payment method to attempt to fulfill this PaymentIntent again.

				break;
			case "payment_intent_payment_attempt_failed": // The latest payment attempt for the PaymentIntent has failed. Check the last_payment_error property on the PaymentIntent for more details, and provide a new payment method to attempt to fulfill this PaymentIntent again.

				break;
			case "payment_intent_unexpected_state": // The PaymentIntent’s state was incompatible with the operation you were trying to perform.

				break;
			case "payment_method_bank_account_already_verified": // This bank account has already been verified.

				break;
			case "payment_method_bank_account_blocked": // This bank account has failed verification in the past and can not be used. Contact us if you wish to attempt to use these bank account credentials.

				break;
			case "payment_method_currency_mismatch": // The currency specified does not match the currency for the attached payment method. A payment can only be created for the same currency as the corresponding payment method.

				break;
			case "payment_method_invalid_parameter": // Invalid parameter was provided in the payment method object. Check our API documentation or the returned error message for more context.

				break;
			case "payment_method_microdeposit_failed": // Microdeposits were failed to be deposited into the customer’s bank account. Please check the account, institution and transit numbers as well as the currency type.

				break;
			case "payment_method_microdeposit_verification_amounts_invalid": // You must provide exactly two microdeposit amounts.

				break;
			case "payment_method_microdeposit_verification_amounts_mismatch": // The amounts provided do not match the amounts that were sent to the bank account.

				break;
			case "payment_method_microdeposit_verification_attempts_exceeded": // You have exceeded the number of allowed verification attempts.

				break;
			case "payment_method_microdeposit_verification_timeout": // Payment method should be verified with microdeposits within the required period.

				break;
			case "payment_method_provider_decline": // The payment was declined by the issuer or customer. Check the last_payment_error property on the PaymentIntent for more details, and provide a new payment method to attempt to fulfill this PaymentIntent again.

				break;
			case "payment_method_provider_timeout": // The payment method failed due to a timeout. Check the last_payment_error property on the PaymentIntent for more details, and provide a new payment method to attempt to fulfill this PaymentIntent again.

				break;
			case "payment_method_unactivated": // The operation cannot be performed as the payment method used has not been activated. Activate the payment method in the Dashboard, then try again.

				break;
			case "payment_method_unexpected_state": // The provided payment method’s state was incompatible with the operation you were trying to perform. Confirm that the payment method is in an allowed state for the given operation before attempting to perform it.

				break;
			case "payment_method_unsupported_type": // The API only supports payment methods of certain types.

				break;
			case "payouts_not_allowed": // Payouts have been disabled on the connected account. Check the connected account’s status to see if any additional information needs to be provided, or if payouts have been disabled for another reason.

				break;
			case "platform_account_required": // Only Stripe Connect platforms can work with other accounts. If you need to setup a Stripe Connect platform, you can do so in the dashboard.

				break;
			case "platform_api_key_expired": // The API key provided by your Connect platform has expired. This occurs if your platform has either generated a new key or the connected account has been disconnected from the platform. Obtain your current API keys from the Dashboard and update your integration, or reach out to the user and reconnect the account.

				break;
			case "postal_code_invalid": // The postal code provided was incorrect.

				break;
			case "processing_error": // An error occurred while processing the card. Try again later or with a different payment method.

				break;
			case "product_inactive": // The product this SKU belongs to is no longer available for purchase.

				break;
			case "rate_limit": // Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.

				break;
			case "resource_already_exists": // A resource with a user-specified ID (e.g., plan or coupon) already exists. Use a different, unique value for id and try again.

				break;
			case "resource_missing": // The ID provided is not valid. Either the resource does not exist, or an ID for a different resource has been provided.

				break;
			case "routing_number_invalid": // The bank routing number provided is invalid.

				break;
			case "secret_key_required": // The API key provided is a publishable key, but a secret key is required. Obtain your current API keys from the Dashboard and update your integration to use them.

				break;
			case "sepa_unsupported_account": // Your account does not support SEPA payments.

				break;
			case "setup_attempt_failed": // The latest setup attempt for the SetupIntent has failed. Check the last_setup_error property on the SetupIntent for more details, and provide a new payment method to attempt to set it up again.

				break;
			case "setup_intent_authentication_failure": // The provided payment method has failed authentication. Provide a new payment method to attempt to fulfill this SetupIntent again.

				break;
			case "setup_intent_invalid_parameter": // One or more provided parameters was not allowed for the given operation on the SetupIntent. Check our API reference or the returned error message to see which values were not correct for that SetupIntent.

				break;
			case "setup_intent_unexpected_state": // The SetupIntent’s state was incompatible with the operation you were trying to perform.

				break;
			case "shipping_calculation_failed": // Shipping calculation failed as the information provided was either incorrect or could not be verified.

				break;
			case "sku_inactive": // The SKU is inactive and no longer available for purchase. Use a different SKU, or make the current SKU active again.

				break;
			case "state_unsupported": // Occurs when providing the legal_entity information for a U.S. custom account, if the provided state is not supported. (This is mostly associated states and territories.)

				break;
			case "tax_id_invalid": // The tax ID number provided is invalid (e.g., missing digits). Tax ID information varies from country to country, but must be at least nine digits.

				break;
			case "taxes_calculation_failed": // Tax calculation for the order failed.

				break;
			case "terminal_location_country_unsupported": // Terminal is currently only available in some countries. Locations in your country cannot be created in livemode.

				break;
			case "testmode_charges_only": // Your account has not been activated and can only make test charges. Activate your account in the Dashboard to begin processing live charges.

				break;
			case "tls_version_unsupported": // Your integration is using an older version of TLS that is unsupported. You must be using TLS 1.2 or above.

				break;
			case "token_already_used": // The token provided has already been used. You must create a new token before you can retry this request.

				break;
			case "token_in_use": // The token provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.

				break;
			case "transfers_not_allowed": // The requested transfer cannot be created. Contact us if you are receiving this error.

				break;
			case "upstream_order_creation_failed": // The order could not be created. Check the order details and then try again.

				break;
			case "url_invalid": // The URL provided is invalid.

				break;
			default:
				error.message = "カード決済エラー : ";
		}

		return error;
	}

	/**
	 * get_self
	 *
	 * アカウントゲット
	 *
	 * @param operator
	 * @param callback
	 * @returns none
	 */
	private get_self(operator: IAccountModel, callback: Callback<IAccountModel>): void {
		LocalAccount.default_find_by_id(operator, operator.user_id).then((account: IAccountModel): void => {
			callback(null, account);
		}).catch((error: IErrorObject): void => {
			callback(error, null);
		});
	}

	/**
	 * put_self
	 *
	 * アカウントプット
	 *
	 * @param operator
	 * @param update
	 * @param callback
	 * @returns none
	 */
	private put_self(operator: IAccountModel, update: object, callback: Callback<IAccountModel>): void {
		LocalAccount.set_by_id(operator, operator.user_id, update).then((account: IAccountModel): void => {
			callback(null, account);
		}).catch((error: IErrorObject): void => {
			callback(error, null);
		})
	}

	/*
	* hasSameSubscriptions
	*
	* 同一プランチェック。
	*
	* @param subscriptions_1
	* @param subscriptions_2
	*/
	private hasSameSubscriptions(subscriptions_1: any, subscriptions_2: any): any[] {

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
	 * all_subscriptions
	 *
	 */
	private allSubscriptions(callback: Callback<any>): void {
		try {
			this.stripe.subscriptions.list({}).then((subscriptions: any[]) => {
				callback(null, subscriptions);
			}).catch((error: IErrorObject): void => {
				callback(Stripe.translationError(error), null);
			});
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * payable
	 *
	 * @param operator
	 * @param callback
	 * @returns none
	 *
	 * 送り先あり 1
	 * カードあり 2
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
	 * Customer
	 *
	 * @param stripe_id
	 * @returns none
	 */
	public Customer(stripe_id: string): Promise<any> {
		return this.stripe.customers.retrieve(stripe_id);
	}

	/**
	 * operatorToCustomer
	 *
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
					}).catch((error: IErrorObject): void => {
						callback(Stripe.translationError(error), null);
					});
				} else {
					callback(null, null);
				}
			}).catch((error: IErrorObject): void => {
				callback(error, null);
			});
		} catch (error: any) {
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
					if (request.user.auth > AuthLevel.manager) {  // 　Common User
						const operator: IAccountModel = this.Transform(request.user);
						this.operatorToCustomer(operator, (error, customer) => {
							if (!error) {
								this.SendSuccess(response, Boolean(customer));
							} else {
								this.SendError(response, error);
							}
						});
					} else { // Manageing User
						this.SendSuccess(response, true);
					}
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00445"));
				}
			});
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * createCustomer
	 *
	 * @param request
	 * @param response
	 * @returns none
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
							this.SendError(response, Stripe.translationError(error));
						});
					} else {
						this.SendError(response, Errors.generalError(1, "no customer data.", "S00447"));
					}
				} else {
					this.SendError(response, Errors.generalError(-1, "not logged in.", "S00448"));
				}
			});
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * retrieveCustomer
	 *
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
								const result_customer = {
									sources: {
										data: customer.sources.data,
										default: customer.default_source,
										updateable: updateable
									}
								};
								this.SendSuccess(response, result_customer);
							} else {
								this.SendSuccess(response, null);
							}
						} else {
							this.SendError(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "not logged in.", "S00401"));
				}
			});
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * updateCustomer
	 *
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
									this.SendError(response, Stripe.translationError(error));
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * deleteCustomer
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	/*
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
									this.SendError(response, Stripe.translationError(error));
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}
*/

	public deleteCustomer(request: any, response: IJSONResponse): void {
		try {
			this.innerDeleteCustomer(request.user, (error: IErrorObject, customer_id) => {
				if (!error) {
					this.SendSuccess(response, customer_id);
				} else {
					this.SendError(response, Stripe.translationError(error));
				}
			})
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * innerDeleteCustomer
	 *
	 * @param user
	 * @param callback
	 * @returns none
	 */
	public innerDeleteCustomer(user: any, callback: Callback<any>): void {
		try {
			if (user) {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(user);
					this.get_self(operator, (error, account: any) => {
						if (!error) {
							const stripe_id = account.content.stripe_id;
							if (stripe_id) {
								this.logger.info('begin deleteCustomer. ' + operator.username);
								this.stripe.customers.del(stripe_id).then((customer: any) => {
									this.logger.info('end deleteCustomer. ' + operator.username);
									this.put_self(operator, {"content.stripe_id": null}, (error, account) => {
										if (!error) {
											callback(null, customer.id);
										} else {
											callback(error, null);
										}
									});
								}).catch((error: any) => {
									callback(Stripe.translationError(error), null);
								});
							} else {
								callback(null, null);
							}
						} else {
							callback(error, null);
						}
					});
				} else {
					callback(Errors.generalError(-1, "disabled.", "S00407"), null);
				}
			} else {
				callback(Errors.userError(1, "not logged in.", "S00405"), null);
			}
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * create card
	 *
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
												this.SendError(response, Stripe.translationError(error));
											})
										}).catch((error: any) => {
											this.SendError(response, Stripe.translationError(error));
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * retrieveSource
	 *
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
										this.SendError(response, Stripe.translationError(error));
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * updateSource
	 *
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
										this.SendError(response, Stripe.translationError(error));
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
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00318"));
				}
			});
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * deleteSource
	 *
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
									this.SendError(response, Stripe.translationError(error));
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * sendBankReceipt
	 *
	 * @param mailto
	 * @param append
	 * @param callback
	 */
	public sendBankReceipt(mailto: { address: string, charge: any, customer: any }, append: any[], callback: Callback<any>): void {

		// const mail_object = this.module_config.receiptmail;
		const immutable = JSON.parse(JSON.stringify(this.module_config.receiptmail));

		const formatter = new Intl.NumberFormat('ja-JP');

		immutable.html.content.text = immutable.text.content.text = [
			`amount: ¥${formatter.format(mailto.charge.amount)}`,
		];

		append.forEach((line) => {
			immutable.text.content.text.push(line);
		});

		immutable.text.content.text.push(`description: ${mailto.charge.description}`);

		const mutable = {link: mailto.charge.receipt_url};

		this.sendMail({
			address: mailto.address,
			bcc: this.bcc,
			title: "Recept",
			template_url: "views/plugins/stripe/mail/mail_template.ejs",
			immutable: immutable,
			mutable: mutable,
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
	 * sendDeliveryReceipt
	 *
	 * @param mailto
	 * @param append
	 * @param callback
	 */
	public sendDeliveryReceipt(mailto: { address: string, charge: any, customer: any }, append: any[], callback: Callback<any>): void {

		// const mail_object = this.module_config.receiptmail;
		const immutable = JSON.parse(JSON.stringify(this.module_config.receiptmail));

		const formatter = new Intl.NumberFormat('ja-JP');

		immutable.html.content.text = immutable.text.content.text = [
			`amount: ¥${formatter.format(mailto.charge.amount)}`,
		];

		append.forEach((line) => {
			immutable.text.content.text.push(line);
		});
		immutable.text.content.text.push(`description: ${mailto.charge.description}`);

		const mutable = {link: mailto.charge.receipt_url};

		this.sendMail({
			address: mailto.address,
			bcc: this.bcc,
			title: "Recept",
			template_url: "views/plugins/stripe/mail/mail_template.ejs",
			immutable: immutable,
			mutable: mutable,
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
	 * sendCardReceipt
	 *
	 * @param mailto
	 * @param append
	 * @param callback
	 */
	public sendCardReceipt(mailto: { address: string, charge: any, customer: any }, append: any[], callback: Callback<any>): void {
		const card = mailto.charge.payment_method_details.card;
		// const mail_object = this.module_config.receiptmail;
		const immutable = JSON.parse(JSON.stringify(this.module_config.receiptmail));

		const formatter = new Intl.NumberFormat('ja-JP');

		immutable.html.content.text = immutable.text.content.text = [
			`amount: ¥${formatter.format(mailto.charge.amount)}`,
			`-`,
			`card: ${card.brand}`,
			`last4: ${card.last4}`,
			`expired: ${card.exp_month}/${card.exp_year}`,
			`-`,
			`status: ${mailto.charge.outcome.seller_message}`,
		];

		append.forEach((line) => {
			immutable.text.content.text.push(line);
		});

		immutable.text.content.text.push(`description: ${mailto.charge.description}`);

		const mutable = {link: mailto.charge.receipt_url};

		this.sendMail({
			address: mailto.address,
			bcc: this.bcc,
			title: "Recept",
			template_url: "views/plugins/stripe/mail/mail_template.ejs",
			immutable: immutable,
			mutable: mutable,
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
	 * charge
	 *
	 * チャージ
	 *
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

								callback(null, {
									address: customer.email || operator.username,
									charge: charge,
									customer: customer
								});
							} else {
								callback(Errors.generalError(1000, "Stripe error.", "S00422"), null);
							}
						}).catch((error: any) => {
							callback(Stripe.translationError(error), null);
						})
					} else {
						callback(Errors.generalError(1, "no customer.", "S00423"), null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * subscribe
	 *
	 * 定期課金
	 *
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
						this.allSubscriptions((error, all_subscriptions) => { // 同一プランがなければ
							if (!error) {
								const subscriptions = this.hasSameSubscriptions(all_subscriptions, customer.subscriptions);
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
										callback(Stripe.translationError(error), null);
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
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * hasSubscribe
	 *
	 * @param request
	 * @param callback
	 * @returns none
	 */
	public hasSubscribe(request: any, callback: Callback<boolean>): void {
		try {
			const operator: IAccountModel = this.Transform(request.user);
			if (operator.auth <= AuthLevel.manager) {
				callback(null, true);
			} else {
				this.operatorToCustomer(operator, (error: IErrorObject, customer: any) => {
					if (!error) {
						if (customer) {
							this.allSubscriptions((error, all_subscriptions) => { // 全てのプラン
								if (!error) {
									const result = this.hasSameSubscriptions(all_subscriptions, customer.subscriptions);　// 自分のプランは？
									const is_subscribe = (result.length > 0);
									callback(null, is_subscribe);
								} else {
									callback(error, null);
								}
							});
						} else {
							callback(null, false);
						}
					} else {
						callback(error, null);
					}
				});
			}
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * operatorToCustomer
	 *
	 * @param request
	 * @param response
	 * @returns none
	 */
	public isSubscribeUser(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S03415"), request.user, () => {
				if (this.enable) {
					const operator: IAccountModel = this.Transform(request.user);
					const username = request.params.username;
					LocalAccount.default_find_by_name(operator, username).then((account: IAccountModel): void => {
						const stripe_id = account.content.stripe_id;
						if (stripe_id) {
							this.stripe.customers.retrieve(stripe_id).then((customer: any) => {
								this.isSubscribeCustomer(customer, (error: IErrorObject, is_subscribe: boolean) => {
									if (!error) {
										if (is_subscribe) {
											this.SendSuccess(response, 1); // subscribe
										} else {
											this.SendSuccess(response, 0); // not subscribe
										}
									} else {
										this.SendError(response, error);
									}
								});
							}).catch((error: any) => {
								this.SendSuccess(response, -1); // invalid stripe account
								// 			this.SendError(response, Stripe.translationError(error));
							});
						} else {
							this.SendSuccess(response, -2);  // no stripe account
						}
					}).catch((error: IErrorObject) => {
						this.SendError(response, error);
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00428"));
				}
			});
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * isSubscribeCustomer
	 *
	 * @param customer
	 * @param callback
	 * @returns none
	 */
	public isSubscribeCustomer(customer: any, callback: Callback<boolean>): void {
		this.allSubscriptions((error, all_subscriptions) => { // 全てのプラン
			if (!error) {
				const result = this.hasSameSubscriptions(all_subscriptions, customer.subscriptions);　// 自分のプランは？
				const is_subscribe = (result.length > 0);
				callback(null, is_subscribe);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * isSubscribeId
	 *
	 * @param stripe_id
	 * @param callback
	 * @returns none
	 */
	public isSubscribeId(stripe_id: string, callback: Callback<number>): void {
		try {
			if (stripe_id) {
				this.stripe.customers.retrieve(stripe_id).then((customer: any) => {
					this.isSubscribeCustomer(customer, (error: IErrorObject, is_subscribe: boolean) => {
						if (!error) {
							if (is_subscribe) {
								callback(null, 1); // subscribe
							} else {
								callback(null, 0); // not subscribe
							}
						} else {
							callback(error, null);
						}
					});
				}).catch((error: any) => {
					callback(null, -1); // invalid stripe account
					// 			this.SendError(response, Stripe.translationError(error));
				});
			} else {
				callback(null, -2);  // no stripe account
			}
		} catch (error: any) {
			this.SendError(error, null);
		}
	}

	/**
	 * updateSubscribe
	 *
	 * 定期課金更新
	 *
	 * @param request
	 * @param metadata
	 * @param callback
	 * @returns none
	 */
	public updateSubscribe(request: any, metadata: any, callback: Callback<any>): void {
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

											// 		const subscription_id = subscription.id;

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
								callback(Stripe.translationError(error), null);
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
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * cancel_subscribe
	 *
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
								callback(Stripe.translationError(error), null);
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
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * receipt
	 *
	 * レシート
	 *
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
						callback(null, {
							address: customer.email || operator.username,
							charge: charge,
							customer: customer
						});
					} else {
						callback(Errors.generalError(1, "no customer.", "S00431"), null);
					}
				} else {
					callback(error, null);
				}
			});
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * _charge
	 *
	 * チャージ
	 *
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
		} catch (error: any) {
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	public has_subscribe(request: any, response: IJSONResponse): void {
		try {
			// this.ifExist(response, Errors.userError(1, "not logged in.", "S00436"), request.user, () => {
			if (request.user) {
				if (this.enable) {
					this.hasSubscribe(request, (error, subscribe: boolean) => {
						if (!error) {
							this.SendSuccess(response, subscribe);
						} else {
							this.SendWarn(response, error);
						}
					});
				} else {
					this.SendError(response, Errors.generalError(-1, "disabled.", "S00437"));
				}
			} else {
				this.SendSuccess(response, false);
			}
			// 	});
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	public update_subscribe(request: any, response: IJSONResponse): void {
		try {
			this.ifExist(response, Errors.userError(1, "not logged in.", "S00438"), request.user, () => {
				if (this.enable) {
					this.updateSubscribe(request, request.body, (error, subscribe: any) => {
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
		} catch (error: any) {
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
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

	/**
	 * charge参照
	 *
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
				callback(Stripe.translationError(error), null);
			})
		} catch (error: any) {
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
				callback(Stripe.translationError(error), null);
			})
		} catch (error: any) {
			callback(error, null);
		}
	}

	/**
	 * operatorToCustomer
	 *
	 * @param request
	 * @param response
	 * @returns
	 *  1 subscribed.
	 *  0 unsubscribed.
	 * -1 invalid stripe account.
	 * -2 no stripe account.
	 * -3 error.
	 */
	public isSubscribeUserPublic(request: any, response: IJSONResponse): void {
		try {
			if (this.enable) {
				const key: { key: string } = request.query;
				const username = request.params.username;
				LocalAccount.default_find_by_name(null, username).then((account: IAccountModel): void => {
					const stripe_id = account.content.stripe_id;
					if (stripe_id) {
						this.stripe.customers.retrieve(stripe_id).then((customer: any) => {
							this.isSubscribeCustomer(customer, (error: IErrorObject, is_subscribe: boolean) => {
								if (!error) {
									if (is_subscribe) {
										this.SendSuccess(response, 1); // 課金
									} else {
										this.SendSuccess(response, 0); // 非課金
									}
								} else {
									this.SendError(response, error);
								}
							});
						}).catch((error: any) => {
							this.SendSuccess(response, -1); // stripeアカウント不明
						});
					} else {
						this.SendSuccess(response, -2);  // stripeアカウント未登録
					}
				}).catch((error: IErrorObject) => {
					this.SendError(response, error);
				});
			} else {
				this.SendError(response, Errors.generalError(-1, "disabled.", "S00428"));
			}
		} catch (error: any) {
			this.SendError(response, error);
		}
	}

}

module.exports = Stripe;
