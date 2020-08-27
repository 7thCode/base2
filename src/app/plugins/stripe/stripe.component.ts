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
import {InfoDialogComponent} from "../../platform/base/components/info-dialog/info-dialog.component";

import {SessionService} from "../../platform/base/services/session.service";
import {StripeService} from "./stripe.service";

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
				city: "西宮市", // City, district, suburb, town, or village.
				country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
				line1: "安井町", // Address line 1 (e.g., street, PO Box, or company name).
				line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
				postal_code: "662-0045", // ZIP or postal code.
				state: "兵庫県" // State, county, province, or region.
			},
			description: "自分", // An arbitrary string attached to the object. Often useful for displaying to users.
			email: "oda.mikio@gmail.com", // The customer’s email address.
			metadata: {order_id: '6735'}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
			name: "7thCode",  // The customer’s full name or business name.
			phone: "", // The customer’s phone number.
			shipping: { // Mailing and shipping address for the customer. Appears on invoices emailed to this customer.
				address: {
					city: "西宮市", // City, district, suburb, town, or village.
					country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
					line1: "安井町", // Address line 1 (e.g., street, PO Box, or company name).
					line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
					postal_code: "662-0045", // ZIP or postal code.
					state: "兵庫県" // State, county, province, or region.
				},
				name : "織田", // Customer name.
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

	/**
	 *
	 * @param session
	 * @param snackbar
	 * @param matDialog
	 * @param stripeService
	 */
	constructor(
		protected session: SessionService,
		protected matDialog: MatDialog,
		private stripeService: StripeService,
		protected snackbar: MatSnackBar,
		public changeDetectorRef: ChangeDetectorRef
	) {
		super(session, matDialog);
	}

	/**
	 * エラー表示
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 0,
			});
		}
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
		this.Progress(true);
		this.stripeService.retrieveCustomer((error: IErrorObject, result: any) => {
			if (!error) {
				if (result) {
					const cards = result.sources.data;
					const default_source = result.sources.default;
					this.results = cards.map((card: any) => {
						card = this.toListView(card);

						card.view_class = "box-body";
						let padding = "****-****-****-";
						switch (card.brand) {
							case "Visa":
								card.view_class = "visa-box-body";
								break;
							case "MasterCard":
								card.view_class = "master-box-body";
								break;
							case "JCB":
								card.view_class = "jcb-box-body";
								break;
							case "American Express":
								card.view_class = "amex-box-body";
								padding = "****-******-*";
								break;
							case "Diners Club":
								card.view_class = "diners-box-body";
								padding = "****-******-";
								break;
							default:
						}
						card.display_no = padding + card.last4;

						card.is_default = false;
						if (card.id === default_source) {
							card.view_class = "default-box-body";
							switch (card.brand) {
								case "Visa":
									card.view_class = "default-visa-box-body";
									break;
								case "MasterCard":
									card.view_class = "default-master-box-body";
									break;
								case "JCB":
									card.view_class = "default-jcb-box-body";
									break;
								case "American Express":
									card.view_class = "default-amex-box-body";
									break;
								case "Diners Club":
									card.view_class = "default-diners-box-body";
									break;
								default:
							}
							card.is_default = true;
						}

						return card;
					});
					callback(null, cards);
				} else {
					this.results = [];
					callback(null, null);
				}
			}
			this.Progress(false);
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
			width: "fit-content",
			height: "fit-content",
			data: {content: initalData},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);
				this.createSource(result.content, (error, cards) => {
					if (error) {
						this.errorBar(error);
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
					width: "fit-content",
					height: "fit-content",
					data: {content: result.sources.updateable},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: any): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.stripeService.updateCustomer(result.content, (error: IErrorObject, result: any) => {
							this.draw((error: IErrorObject, cards: object[] | null): void => {
							});
							this.Progress(false);
						})
					}
				});

				dialog.afterClosed().subscribe((result: any): void => {
					this.Complete("", result);
				});
			} else {
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

	public createCustomer() {
		this.stripeService.createCustomer({email: "test3@test.com"}, (error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public retrieveCustomer() {
		this.stripeService.retrieveCustomer((error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public updateCustomer() {

		const update =	{
			address: {  // The customer’s address.
				city: "西宮市", // City, district, suburb, town, or village.
				country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
				line1: "安井町", // Address line 1 (e.g., street, PO Box, or company name).
				line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
				postal_code: "662-0045", // ZIP or postal code.
				state: "兵庫県" // State, county, province, or region.
			},
			description: "自分", // An arbitrary string attached to the object. Often useful for displaying to users.
			email: "oda.mikio@gmail.com", // The customer’s email address.
			metadata: {order_id: '6735'}, // Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
			name: "7thCode",  // The customer’s full name or business name.
			phone: "", // The customer’s phone number.
			shipping: { // Mailing and shipping address for the customer. Appears on invoices emailed to this customer.
				address: {
					city: "西宮市", // City, district, suburb, town, or village.
					country: "JP", // Two-letter country code (ISO 3166-1 alpha-2).
					line1: "安井町", // Address line 1 (e.g., street, PO Box, or company name).
					line2: "5-4", // Address line 2 (e.g., apartment, suite, unit, or building).
					postal_code: "662-0045", // ZIP or postal code.
					state: "兵庫県" // State, county, province, or region.
				},
				name : "織田", // Customer name.
				phone: "", // Customer phone (including extension).
			}
		}

		this.stripeService.updateCustomer(update, (error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public deleteCustomer() {
		this.stripeService.deleteCustomer((error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public createSource(card: any, callback: (error: IErrorObject, result: any) => void): void {
		this.stripeService.createSource({card: card}, (error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
				callback(error, cards);
			});
		})
	}

	public retrieveSource(index: number): void {
		this.stripeService.retrieveSource(index, (error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public updateSource(index: number, content: any): void {
		this.stripeService.updateSource(index, content, (error: IErrorObject, result: any) => {
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public deleteSource(index: number): void {
		const resultDialogContent: any = {title: "Card", message: "Delete this?."};
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
				this.stripeService.deleteSource(index, (error: IErrorObject, result: any) => {
					this.draw((error: IErrorObject, cards: object[] | null): void => {
					});
				})
			}
		});
	}

	public updateDefault(id: string) {
		this.stripeService.updateCustomer({default_source: id}, (error: IErrorObject, result: any) => {
			if (!error) {
				this.draw((error: IErrorObject, cards: object[] | null): void => {
					this.changeDetectorRef.detectChanges();
				});
			}
		})
	}

	public charge() {
		const charge = {
			amount: 100,
			currency: "jpy",
			description: "HOGE"
		}
		this.stripeService.charge(charge, (error: IErrorObject, result: any) => {
			console.log(result);
		})
	}
}

