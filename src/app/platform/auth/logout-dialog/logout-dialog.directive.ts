/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

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

		const dialog: MatDialogRef<any> = this.matDialog.open(LogoutDialogComponent, {
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Logout",
					description: "Lorem ipsum...",
				}
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
