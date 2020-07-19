/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject, IVaultModelContent} from "../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {GridViewComponent} from "../base/components/gridview.component";
import {VaultDialogComponent} from "./vault-dialog/vault-dialog.component";

import {PublicKeyService} from "../base/services/publickey.service";
import {SessionService} from "../base/services/session.service";
import {VaultsService} from "./vaults.service";

/**
 * 秘匿データレコード
 *
 * @since 0.01
 */
@Component({
	selector: "vaults",
	templateUrl: "./vaults.component.html",
	styleUrls: ["./vaults.component.css"],
})
export class VaultsComponent extends GridViewComponent implements OnInit {

	/**
	 * @constructor
	 *
	 * @param session
	 * @param http
	 * @param vaultsService
	 * @param PublicKey
	 * @param change
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected vaultsService: VaultsService,
		protected PublicKey: PublicKeyService,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, matDialog);
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
	 * リストビューデコレータ
	 * @param object
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

	public ngOnInit(): void {
		this.sort = {};
		super.ngOnInit();
	}

	/**
	 * 新規作成
	 * @returns none なし
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
			height: "fit-content",
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
	 * 更新ダイアログ
	 * @param resource 更新対象レコード
	 */
	public updateDialog(resource: {parent_id: string}): void {
		this.get(resource.parent_id, (error: IErrorObject, result: object): void => {
			if (!error) {
				const dialog: any = this.matDialog.open(VaultDialogComponent, {
					width: "40vw",
					height: "fit-content",
					data: {content: this.toView(result)},
					disableClose: true,
				});

				dialog.beforeClosed().subscribe((result: {content: object}): void => {
					if (result) { // if not cancel then
						this.Progress(true);
						this.update(resource.parent_id, this.confirmToModel(result.content), (error, result: any): void => {
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
	 * 削除
	 * @param id 削除対象レコード
	 */
	public onDelete(resource: {parent_id: string}): void {
		this.Progress(true);
		this.delete(resource.parent_id, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.Complete("", result);
			} else {
				this.Complete("error", error);
			}
			this.Progress(false);
		});
	}

}
