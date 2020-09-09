/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";

import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {CustomerLoginQrDialogComponent} from "./customer-login-qr-dialog.component";

@Directive({
	selector: "[customer-login-qr-button]",
})

export class CustomerLoginQrDialogDirective {

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

		const dialog: MatDialogRef<any> = this.matDialog.open(CustomerLoginQrDialogComponent, {
			width: "60%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "QRコードでログイン",
					description: "ようこそ！",
					username: "",
					password: "",
					code: "",
				},
			},

			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			this.complete.emit(result);
		});
	}

}
