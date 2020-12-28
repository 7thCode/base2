/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {InfoDialogComponent} from "../../base/components/info-dialog/info-dialog.component";
import {PasswordImmediateDialogComponent} from "./password-immediate-dialog.component";

@Directive({
	selector: "[auth-password-immediate-button]",
})

export class PasswordImmediateDialogDirective {

	@Input() public username: string;

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

		const resultDialogContent: any = {title: "Changed.", message: "Success."};

		const dialog: MatDialogRef<any> = this.matDialog.open(PasswordImmediateDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Password",
					description: "change password...",
					username: this.username,
					password: "",
					confirm_password: "",
				},
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			if (result) {
				const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
					width: "30%",
					minWidth: "320px",
					height: "fit-content",
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
