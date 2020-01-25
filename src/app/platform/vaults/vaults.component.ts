/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IVaultModelContent} from "../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component} from "@angular/core";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {GridViewComponent} from "../base/components/gridview.component";
import {VaultDialogComponent} from "./vault-dialog/vault-dialog.component";

import {ConstService} from "../../config/const.service";
import {PublicKeyService} from "../base/services/publickey.service";
import {SessionService} from "../base/services/session.service";
import {VaultsService} from "./vaults.service";

@Component({
	selector: "vaults",
	templateUrl: "./vaults.component.html",
	styleUrls: ["./vaults.component.css"],
})

/**
 *
 *
 * @since 0.01
 */
export class VaultsComponent extends GridViewComponent {

	/**
	 *
	 * @param session
	 * @param http
	 * @param constService
	 * @param vaultsService
	 * @param PublicKey
	 * @param change
	 * @param matDialog
	 * @param observableMedia
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected constService: ConstService,
		protected vaultsService: VaultsService,
		protected PublicKey: PublicKeyService,
		protected change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		protected observableMedia: MediaObserver,
		protected snackbar: MatSnackBar,
	) {
		super(session, change, matDialog, observableMedia);
		this.service = vaultsService;
	}

	/**
	 *
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public createDialog(): void {

		const initalData: IVaultModelContent = {
			id: "",
			parent_id: "",
			enabled: true,
			category: "",
			status: 0,
			type: "",
			value: "",
			accessory: {},
		};

		const dialog: any = this.matDialog.open(VaultDialogComponent, {
			width: "40vw",
			data: {content: this.toView(initalData)},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);

				// result.content.value.customer_email = "oda.mikio@gmail.com";
				// result.content.value.exp_month = "10";
				// result.content.value.exp_year = "21";
				// result.content.value.number = "1234567812345678";
				// result.content.value.cvc = "100";

				this.create(this.confirmToModel(result), (error: IErrorObject, result: object): void => {
					if (error) {
						this.Complete("error", error);
					}
					this.Progress(false);
				});
			}
		});

		dialog.afterClosed().subscribe((result: object): void => {
			this.Complete("", result);
		});

	}

	/**
	 *
	 * @param id
	 */
	public updateDialog(id: string): void {
		this.get(id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(VaultDialogComponent, {
					width: "40vw",
					data: {content: this.toView(result)},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: {content: object}): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.update(id, this.confirmToModel(result.content), (error, result: any): void => {
							if (error) {
								this.Complete("error", error);
							}
							this.Progress(false);
						});
					}
				});

				dialog.afterClosed().subscribe((result: object): void => {
					this.Complete("", result);
				});
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 *
	 * @param id
	 */
	public onDelete(id: string): void {
		this.Progress(true);
		this.delete(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.Complete("", result);
			} else {
				this.Complete("error", error);
			}
			this.Progress(false);
		});
	}

	/**
	 *
	 * @param object
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

}
