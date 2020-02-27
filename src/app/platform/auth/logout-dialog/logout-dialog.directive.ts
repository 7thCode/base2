/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {LogoutDialogComponent} from "./logout-dialog.component";

@Directive({
	selector: "[auth-logout-button]",
})

/**
 *
 */
export class LogoutDialogDirective {

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

		const dialog: any = this.matDialog.open(LogoutDialogComponent, {
			width: "40vw",
			data: {content: {title: "Logout"}},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any) => {
			if (result) {
				this.complete.emit(result);
			}
		});
	}

}
