/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog} from "@angular/material";

import {LoginQrDialogComponent} from "./login-qr-dialog.component";

@Directive({
	selector: "[login-qr-button]",
})

export class LoginQrDialogDirective {

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

		const dialog: any = this.matDialog.open(LoginQrDialogComponent, {
			width: "90vw",
			data: {
				content: {
					title: "Login-qr",
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
