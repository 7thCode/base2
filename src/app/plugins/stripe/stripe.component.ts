/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../../platform/base/components/gridview.component";
import {StripeCustomerUpdateDialogComponent} from "./stripe-customer-update-dialog/stripe-customer-update-dialog.component";
import {StripeCardCreateDialogComponent} from "./stripe-card-create-dialog/stripe-card-create-dialog.component";

import {SessionService} from "../../platform/base/services/session.service";
import {StripeService} from "./stripe.service";

import * as _ from 'lodash';
import {Overlay} from "@angular/cdk/overlay";
import {YesNoDialogComponent} from "../../platform/base/components/yes-no-dialog/yes-no-dialog.component";
import {Spinner} from "../../platform/base/library/spinner";

/*

		Test Numbers

		4111111111111111	Visa
		4242424242424242	Visa
		4012888888881881	Visa
		5555555555554444	MasterCard
		5105105105105100	MasterCard
		378282246310005		American Express
		371449635398431		American Express
		30569309025904		Diner's Club
		38520000023237		Diner's Club
		3530111333300000	JCB
		3566002020360505	JCB

		const update =	{
			address: {  // The customer’s address.
				city: "XX市", // City, district, suburb, town, or village.
				country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
				line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
				line2: "1-1", // Address line 2 (e.g., apartment, suite, unit, or building).
				postal_code: "662-0045", // ZIP or postal code.
				state: "XX県" // State, county, province, or region.
			},
			description: "自分", // An arbitrary string attached to the object. Often useful for displaying to users.
			email: "mail@address.com", // The customer’s email address.
			metadata: {order_id: '6735'}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
			name: "XXXX",  // The customer’s full name or business name.
			phone: "", // The customer’s phone number.
			shipping: { // Mailing and shipping address for the customer. Appears on invoices emailed to this customer.
				address: {
					city: "XX市", // City, district, suburb, town, or village.
					country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
					line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
					line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
					postal_code: "662-0045", // ZIP or postal code.
					state: "XX県" // State, county, province, or region.
				},
				name : "山田", // Customer name.
				phone: "", // Customer phone (including extension).
			}
		}

*/

/**
 * Stripe
 *
 * @since 0.01
 */
@Component({
	selector: "stripe",
	templateUrl: "./stripe.component.html",
	styleUrls: ["./stripe.component.css"],
})
export class StripeComponent extends GridViewComponent implements OnInit {

	public isSubscribe: boolean;
	private spinner: Spinner;

	/**
	 * @param interactionService
	 * @param session
	 * @param overlay
	 * @param snackbar
	 * @param matDialog
	 * @param stripeService
	 * @param changeDetectorRef
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		protected matDialog: MatDialog,
		private stripeService: StripeService,
		protected snackbar: MatSnackBar,
		public changeDetectorRef: ChangeDetectorRef
	) {
		super(session, matDialog);
		this.spinner = new Spinner(overlay);
	}

	/**
	 * エラー表示
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
// 		duration: 8000,
			});
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
// 		duration: 8000,
				panelClass: ["message-snackbar"]
			});
		}
	}

	/**
	 */
	protected Progress(value: boolean): void {
		this.spinner.Progress(value);
	}

	/**
	 * リストビューデコレータ
	 * @param object
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

	/*
	* width to grid columns
	* override
	* @returns columns
 	*/
	protected widthToColumns(width: number): number {
		let result: number = 4;
		if (width < 600) {
			result = 1;  // xs,
		} else if (width < 960) {
			result = 1;  // sm,
		} else if (width < 1280) {
			result = 2;  // md,
		} else if (width < 1920) {
			result = 4; // lg,
		} else {
			result = 4; // xl,
		}
		return result;
	}

	/*
	* */
	public ngOnInit(): void {
		this.sort = {};
		super.ngOnInit();
		this.results = [];
		this.getSession((error: IErrorObject, session: object): void => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		});
	}

	/**
	 * 再描画
	 * @param callback
	 */
	public draw(callback: Callback<object[]>): void {
		const attach_card_design = (card: any): any => {
			card.view_title = "title";
			card.view_class = "box-body";
			let padding = "****-****-****-";
			switch (card.brand) {
				case "Visa":
					card.view_title = "white-title";
					card.view_class = "white-box-body";
					break;
				case "MasterCard":
					card.view_title = "brown-title";
					card.view_class = "brown-box-body";
					break;
				case "JCB":
					card.view_title = "gold-title";
					card.view_class = "gold-box-body";
					break;
				case "American Express":
					card.view_title = "green-title";
					card.view_class = "green-box-body";
					padding = "****-******-*";
					break;
				case "Diners Club":
					card.view_title = "blue-gray-title";
					card.view_class = "blue-gray-box-body";
					padding = "****-******-";
					break;
				default:
			}
			if (card.is_default) {
				card.view_class = "default-" + card.view_class;
			}

			card.display_no = padding + card.last4;
			return card;
		}
		this.Progress(true);
		this.stripeService.is_subscribe((error: IErrorObject, results: any[]) => {
			if (!error) {
				this.isSubscribe = (results.length > 0);
				this.stripeService.retrieveCustomer((error: IErrorObject, result: any) => {
					if (!error) {
						if (result) {
							const cards = result.sources.data;
							const default_source = result.sources.default;

							const results = cards.map((card: any) => {
								card = this.toListView(card);
								card.is_default = (card.id === default_source);
								return attach_card_design(card);
							});

							this.results = _.sortBy(results, [(o) => {
								return o.id;
							}]);

						} else {
							this.results = [];
						}
						callback(null, this.results);
					} else {
						callback(error, null);
					}
					this.Progress(false);
				})
			} else {
				switch (error.code) {
					case 1:
						break;
					default:
						this.errorBar(error);
				}
				callback(error, null);
				this.Progress(false);
			}
		})
	}

	/**
	 * クリエイトダイアログ
	 */
	public createDialog(): void {

		const initalData = {
			number: "4242424242424242",
			exp_month: "",
			exp_year: "",
			cvc: ""
		};

		const dialog: MatDialogRef<any> = this.matDialog.open(StripeCardCreateDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {content: initalData},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				this.createSource(result.content, (error, cards) => {
					if (!error) {

					} else {
						switch (error.code) {
							case 1:
								this.errorBar({code: 1, message: "住所登録が必要です。"});
								break;
							default:
								this.errorBar(error);
								break;
						}
					}
					this.Progress(false);
				});
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});

	}

	public updateCardDialog(id: string): void {

	}

	/**
	 * アップデートダイアログ
	 * @param id ターゲット
	 */
	public updateCustomerDialog(): void {

		this.stripeService.retrieveCustomer((error: IErrorObject, result: any) => {
			if (!error) {

				const dialog: MatDialogRef<any> = this.matDialog.open(StripeCustomerUpdateDialogComponent, {
					width: "50%",
					minWidth: "320px",
					height: "fit-content",
					data: {content: result.sources.updateable},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: any): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.stripeService.updateCustomer(result.content, (error: IErrorObject, result: any) => {
							if (!error) {
								this.draw((error: IErrorObject, cards: object[] | null): void => {
								});
							}
							this.Progress(false);
						})
					}
				});

				dialog.afterClosed().subscribe((result: any): void => {
					this.Complete("", result);
				});
			} else {
				this.errorBar(error);
				this.Complete("error", error);
			}
		})
	}

	/**
	 * 削除
	 * @param id ターゲット
	 */
	public onDelete(event: any, id: string): void {
		/*
				const _delete = (id: string): void => {
					this.Progress(true);
					this.delete(id, (error: IErrorObject, result: any): void => {
						if (!error) {
							this.Complete("", result);
						} else {
							this.Complete("error", error);
						}
						this.Progress(false);
					});
				};

				if (event.shiftKey) { // dialog?
					_delete(id);
				} else {
					const resultDialogContent: any = {title: "Articles", message: "Delete this?."};
					const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
						width: "fit-content",
						height: "fit-content",
						data: {
							session: this.currentSession,
							content: resultDialogContent,
						},
						disableClose: true,
					});
					dialog.afterClosed().subscribe((result: object) => {
						if (result) { // if not cancel then
							_delete(id);
						}
					});
				}
		*/
	}

	/**
	 */
	public createCustomer() {
		this.stripeService.createCustomer({email: "test3@test.com"}, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (error) {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public retrieveCustomer() {
		this.stripeService.retrieveCustomer((error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (error) {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */

	/*
	public updateCustomer() {
		const update = {
			address: {  // The customer’s address.
				city: "XX市", // City, district, suburb, town, or village.
				country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
				line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
				line2: "1-1", // Address line 2 (e.g., apartment, suite, unit, or building).
				postal_code: "100-0001", // ZIP or postal code.
				state: "XX県" // State, county, province, or region.
			},
			description: "自分", // An arbitrary string attached to the object. Often useful for displaying to users.
			email: "mail@address.com", // The customer’s email address.
			metadata: {order_id: '6735'}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
			name: "XXXX",  // The customer’s full name or business name.
			phone: "", // The customer’s phone number.
			shipping: { // Mailing and shipping address for the customer. Appears on invoices emailed to this customer.
				address: {
					city: "XX市", // City, district, suburb, town, or village.
					country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
					line1: "XX町", // Address line 1 (e.g., street, PO Box, or company name).
					line2: "1-1", // Address line 2 (e.g., apartment, suite, unit, or building).
					postal_code: "100-0001", // ZIP or postal code.
					state: "XX県" // State, county, province, or region.
				},
				name: "山田", // Customer name.
				phone: "", // Customer phone (including extension).
			}
		}
		this.stripeService.updateCustomer(update, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (error) {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		})
	}
*/
	/**
	 */
	public deleteCustomer(callback: Callback<any>): void {
		this.stripeService.deleteCustomer((error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (!error) {
						callback(error, cards);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		})
	}

	/**
	 */
	public createSource(card: any, callback: Callback<any>): void {
		this.stripeService.createSource({card: card}, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (!error) {
						callback(error, cards);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		})
	}

	/**
	 */
	public retrieveSource(index: number): void {
		this.stripeService.retrieveSource(index, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (error) {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public updateSource(index: number, content: any): void {
		this.stripeService.updateSource(index, content, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (error) {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public deleteSource(index: number): void {
		const resultDialogContent: any = {title: "Card", message: "Delete this?"};
		const dialog: MatDialogRef<any> = this.matDialog.open(YesNoDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				session: this.currentSession,
				content: resultDialogContent,
			},
			disableClose: true,
		});
		dialog.afterClosed().subscribe((result: object) => {
			if (result) { // if not cancel then
				this.stripeService.deleteSource(index, (error: IErrorObject, result: any) => {
					if (!error) {
						this.draw((error: IErrorObject, cards: object[] | null): void => {
							if (error) {
								this.errorBar(error);
							}
						});
					} else {
						this.errorBar(error);
					}
				})
			}
		});
	}

	/**
	 */
	public updateDefault(id: string) {
		this.stripeService.updateCustomer({default_source: id}, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					if (!error) {
						this.changeDetectorRef.detectChanges();
					} else {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public subscribe() {

		const charge = {
		}

		this.Progress(true);
		this.stripeService.subscribe(charge, (error: IErrorObject, result: any) => {
			this.Progress(false);
			if (!error) {
				this.messageBar("OK");
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public update_subscription() {
		const metadata = {order_id: '1234'};
		this.Progress(true);
		this.stripeService.update_subscribe(metadata, (error: IErrorObject, result: any) => {
			this.Progress(false);
			if (!error) {
				this.messageBar("OK");
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	public cancel_subscription() {
		this.Progress(true);
		this.stripeService.cancel_subscribe( (error: IErrorObject, result: any) => {
			this.Progress(false);
			if (!error) {
				this.messageBar("OK");
			} else {
				this.errorBar(error);
			}
		})
	}

	/**
	 */
	/*
	public charge() {

		const charge = {
			amount: 100,
			currency: "jpy",
			description: "HOGE",
			capture: false
		}

		this.Progress(true);
		this.stripeService.charge(charge, (error: IErrorObject, result: any) => {
			this.Progress(false);
			if (!error) {
				const resultDialogContent: any = {title: "Check mail", message: "Recept Mail sent."};

				const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
					width: "30%",
					minWidth: "320px",
					height: "fit-content",
					data: {content: resultDialogContent},
					disableClose: true,
				});

				dialog.afterClosed().subscribe((result: any) => {
					if (result) {
						this.complete.emit(result);
					}
				});
			} else {
				this.errorBar(error);
			}

		})
	}

	 */
}
