/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

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

		const dialog: MatDialogRef<any> = this.matDialog.open(LoginQrDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Login-qr",
					description: "Lorem ipsum...",
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
