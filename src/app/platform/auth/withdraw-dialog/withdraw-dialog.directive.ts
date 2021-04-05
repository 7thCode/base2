/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {WithdrawDialogComponent} from "./withdraw-dialog.component";

@Directive({
	selector: "[auth-withdraw-button]",
})

export class WithdrawDialogDirective {

	@Output() public complete = new EventEmitter<any>();

	constructor(
		private matDialog: MatDialog
	) {
	}

	@HostListener("click", ["$event.target"])
	public onClick(target: any): void {

		const dialog: MatDialogRef<any> = this.matDialog.open(WithdrawDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Withdraw",
					description: "Lorem ipsum...",
					username: "",
					password: "",
					code: "",
				},
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			this.complete.emit(null);
		});
	}

}
