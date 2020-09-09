/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {CustomerLoginTotpDialogComponent} from "./customer-login-totp-dialog.component";

@Directive({
	selector: "[customer-login-totp-button]",
})

/**
 *
 */
export class CustomerLoginTotpDialogDirective {

	/**
	 *
	 */
	@Output() public complete = new EventEmitter<any>();

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

		const dialog: MatDialogRef<any> = this.matDialog.open(CustomerLoginTotpDialogComponent, {
			width: "60%",
			height: "fit-content",
			data: {
				content: {
					title: "コード入力",
					description: "Google Authenticator等のコードを入力してください。",
					username: "",
					password: "",
					code: "",
				},
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			if (result) {
				this.complete.emit(result);
			}
		});
	}

}
