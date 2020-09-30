/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {LoginTotpDialogComponent} from "./login-totp-dialog.component";

@Directive({
	selector: "[auth-login-totp-button]",
})

/**
 *
 */
export class LoginTotpDialogDirective {

	/**
	 *
	 */
	@Output() public complete = new EventEmitter<any>();

	constructor(
		private matDialog: MatDialog
	) {
	}

	/**
	 *
	 * @param target
	 */
	@HostListener("click", ["$event.target"])
	public onClick(target: any): void {

		const dialog: MatDialogRef<any> = this.matDialog.open(LoginTotpDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Enter Code...",
					description: "Google Authenticator, etc...",
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
