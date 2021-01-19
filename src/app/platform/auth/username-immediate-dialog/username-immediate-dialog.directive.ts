/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {InfoDialogComponent} from "../../base/components/info-dialog/info-dialog.component";
import {UsernameImmediateDialogComponent} from "./username-immediate-dialog.component";

@Directive({
	selector: "[auth-username-immediate-button]",
})

export class UsernameImmediateDialogDirective {


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

		const dialog: MatDialogRef<any> = this.matDialog.open(UsernameImmediateDialogComponent, {
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
