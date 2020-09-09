/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {CustomerLoginTotpDialogComponent} from "../customer-login-totp-dialog/customer-login-totp-dialog.component";
import {CustomerLoginDialogComponent} from "./customer-login-dialog.component";

@Directive({
	selector: "[customer-login-button]",
})

export class CustomerLoginDialogDirective {

	@Output() public complete = new EventEmitter<any>();

	constructor(
		private matDialog: MatDialog,
	) {
	}

	@HostListener("click", ["$event.target"])
	public onClick(target: any): void {

		const dialog: MatDialogRef<any> = this.matDialog.open(CustomerLoginDialogComponent, {
			width: "60%",
			height: "fit-content",
			data: {
				content: {
					title: "Login",
					description: "",
					username: "",
					password: "",
					code: "",
				},
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			if (result) {
				if (result.is_2fa) {
					const dialog: MatDialogRef<any> = this.matDialog.open(CustomerLoginTotpDialogComponent, {
						width:"fit-content",
						height:"fit-content",
						data: result,
						disableClose: true,
					});

					dialog.afterClosed().subscribe((result: any) => {
						if (result) {
							this.complete.emit(result);
						}
					});
				} else {
					this.complete.emit(result);
				}
			} else {
				this.complete.emit(null);
			}
		});
	}

}
