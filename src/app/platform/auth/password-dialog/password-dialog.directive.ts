/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {InfoDialogComponent} from "../../base/components/info-dialog/info-dialog.component";
import {PasswordDialogComponent} from "./password-dialog.component";

@Directive({
	selector: "[auth-password-button]",
})

export class PasswordDialogDirective {

	/**
	 *
	 */
	@Output() public complete = new EventEmitter<any>();

	/**
	 *
	 * @param matDialog
	 */
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

		const resultDialogContent: any = {title: "Check mail", message: "Password Change Mail sent." + " 1065"};

		const dialog: any = this.matDialog.open(PasswordDialogComponent, {
			width: "40vw",
			height: "fit-content",
			data: {
				content: {
					title: "Password",
					username: "",
					password: "",
					confirm_password: "",
				},
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			if (result) {
				const dialog: any = this.matDialog.open(InfoDialogComponent, {
					width: "40vw",
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
