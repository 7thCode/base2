/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {InfoDialogComponent} from "../../base/components/info-dialog/info-dialog.component";
import {RemoveImmediateDialogComponent} from "./remove-immediate-dialog.component";

@Directive({
	selector: "[auth-remove-immediate-button]",
})

export class RemoveImmediateDialogDirective {


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

		const resultDialogContent: any = {title: "Changed.", message: "Sucsess."};

		const dialog: MatDialogRef<any> = this.matDialog.open(RemoveImmediateDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				content: {
					title: "Username",
					description: "change username...",
					original_username: this.username,
					update_username: ""
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
