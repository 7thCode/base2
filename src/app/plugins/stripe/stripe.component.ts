/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../../platform/base/components/gridview.component";
import {StripeCreateDialogComponent} from "./stripe-create-dialog/stripe-create-dialog.component";

import {SessionService} from "../../platform/base/services/session.service";
import {StripeService} from "./stripe.service";
import {InfoDialogComponent} from "../../platform/base/components/info-dialog/info-dialog.component";
import {SessionableComponent} from "../../platform/base/components/sessionable.component";

/**
 * アーティクル
 *
 * @since 0.01
 */
@Component({
	selector: "stripe",
	templateUrl: "./stripe.component.html",
	styleUrls: ["./stripe.component.css"],
})
export class StripeComponent extends SessionableComponent implements OnInit {

	public get isProgress(): boolean {
		return this.progress;
	}

	public results: any[] = [];

	public progress: boolean = false;

	public nickname: string = "";
	public size: number = 20;
	public count: number = 0;

	public breakpoint: number = 4;

	protected query: object = {};
	protected page: number = 0;

	/**
	 *
	 * @param session
	 * @param stripeService
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected matDialog: MatDialog,
		private stripeService: StripeService,
		private snackbar: MatSnackBar,
	) {
		super(session);
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
	 *
	 */
	private widthToColumns(width: number): number {
		let result: number = 4;
		if (width < 600) {
			result = 1;  // xs,
		} else if (width < 960) {
			result = 2;  // sm,
		} else if (width < 1280) {
			result = 4;  // md,
		} else if (width < 1920) {
			result = 6; // lg,
		} else {
			result = 8; // xl,
		}
		return result;
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

	public ngOnInit(): void {
		this.Progress(false);
		this.page = 0;
		this.query = {};

		this.breakpoint =  this.widthToColumns(window.innerWidth);

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
					this.results = cards.map((card: any) => {
						card.cols = 1;
						card.rows = 1;
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
			exp_month: "12",
			exp_year: "2020",
			cvc: "123"
		};

		const dialog: MatDialogRef<any> = this.matDialog.open(StripeCreateDialogComponent, {
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
					this.Progress(true);
				});
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});

	}

	/**
	 * アップデートダイアログ
	 * @param id ターゲット
	 */

	public updateDialog(id: string): void {
		/*
		this.get(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				const dialog: MatDialogRef<any> = this.matDialog.open(StripeDialogComponent, {
					width: "fit-content",
					height: "fit-content",
					data: {content: this.toView(result)},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: any): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.update(id, this.confirmToModel(result.content), (error: IErrorObject, result: any): void => {
							if (error) {
								this.Complete("error", error);
							}
							this.Progress(false);
						});
					}
				});

				dialog.afterClosed().subscribe((result: any): void => {
					this.Complete("", result);
				});
			} else {
				this.Complete("error", error);
			}
		});
		*/
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
			console.log(result);
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public retrieveCustomer() {
		this.stripeService.retrieveCustomer((error: IErrorObject, result: any) => {
			console.log(result);
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public updateCustomer() {
		this.stripeService.updateCustomer({metadata: {order_id: '6735'}}, (error: IErrorObject, result: any) => {
			console.log(result);
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public deleteCustomer() {
		this.stripeService.deleteCustomer((error: IErrorObject, result: any) => {
			console.log(result);
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
		this.stripeService.retrieveSource(index,(error: IErrorObject, result: any) => {
			console.log(result);
			this.draw((error: IErrorObject, cards: object[] | null): void => {
			});
		})
	}

	public updateSource(index: number, content: any): void {
		this.stripeService.updateSource(index, content,(error: IErrorObject, result: any) => {
			console.log(result);
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
				this.stripeService.deleteSource(index,(error: IErrorObject, result: any) => {
					console.log(result);
					this.draw((error: IErrorObject, cards: object[] | null): void => {
					});
				})
			}
		});
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

