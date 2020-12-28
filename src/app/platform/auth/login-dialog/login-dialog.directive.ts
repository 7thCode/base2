/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {LoginTotpDialogComponent} from "../login-totp-dialog/login-totp-dialog.component";
import {LoginDialogComponent} from "./login-dialog.component";

@Directive({
	selector: "[auth-login-button]",
})

export class LoginDialogDirective {

	@Output() public complete = new EventEmitter<any>();

	constructor(
		private matDialog: MatDialog
	) {
	}

	@HostListener("click", ["$event.target"])
	public onClick(target: any): void {

		const dialog: MatDialogRef<any> = this.matDialog.open(LoginDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Login",
					description: "Lorem ipsum...",
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
					result.content.title = "Enter Code.";
					result.content.description = "Google Authenticator, etc...";
					const dialog: MatDialogRef<any> = this.matDialog.open(LoginTotpDialogComponent, {
						width: "30%",
						minWidth: "320px",
						height: "fit-content",
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
