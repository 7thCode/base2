/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog} from "@angular/material";

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

		const dialog: any = this.matDialog.open(LoginDialogComponent, {
			width: "40vw",
			data: {
				content: {
					title: "Login",
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
					const dialog: any = this.matDialog.open(LoginTotpDialogComponent, {
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
			}
		});
	}

}
