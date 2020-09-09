/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {InfoDialogComponent} from "../../../platform/base/components/info-dialog/info-dialog.component";
import {CustomerPasswordDialogComponent} from "./customer-password-dialog.component";

@Directive({
	selector: "[customer-password-button]",
})

export class CustomerPasswordDialogDirective {

	/**
	 *
	 */
	@Output() public complete = new EventEmitter<any>();

	/**
	 *
	 * @param matDialog
	 */
	constructor(
		private matDialog: MatDialog,
	) {
	}

	/**
	 *
	 * @param target
	 */
	@HostListener("click", ["$event.target"])
	public onClick(target: any): void {

		const resultDialogContent: any = {title: "メール送信完了", message: "パスワード変更のメールをお送りしました。メールをご確認ください。"};

		const dialog: MatDialogRef<any> = this.matDialog.open(CustomerPasswordDialogComponent, {
			width: "50%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "パスワード",
					description: "パスワードの再設定を行います。ご登録時のメールアドレスをご入力いただき、新たに設定したいパスワードをご入力の上、送信ボタンを押してください。",
					username: "",
					password: "",
					confirm_password: "",
				},
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			if (result) {
				const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
					width: "50%",
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
			}
		});
	}

}
