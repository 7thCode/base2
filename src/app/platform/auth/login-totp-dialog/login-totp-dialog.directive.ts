/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog} from "@angular/material";

import {LoginTotpDialogComponent} from "./login-totp-dialog.component";

@Directive({
	selector: "[auth-login-totp-button]",
})

export class LoginTotpDialogDirective {

	@Output() public complete = new EventEmitter<any>();

	constructor(
		private matDialog: MatDialog
	) {
	}

	@HostListener("click", ["$event.target"])
	public onClick(target: any): void {

		const dialog: any = this.matDialog.open(LoginTotpDialogComponent, {
			data: {
				content: {
					title: "enter code...",
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
