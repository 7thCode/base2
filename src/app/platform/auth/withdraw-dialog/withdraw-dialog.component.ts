/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../../types/platform/universe";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BaseDialogComponent} from "../../base/components/base-dialog.component";

import {AuthService} from "../auth.service";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "withdraw-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./withdraw-dialog.component.html",
})

export class WithdrawDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	public password_visible: boolean = false;

	/**
	 * @constructor
	 *
	 * @param data
	 * @param matDialogRef
	 * @param snackbar
	 * @param auth
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<any>,
		public snackbar: MatSnackBar,
		public auth: AuthService) {
		super();
	}

	/**
	 *
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 8000,
			});
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
				duration: 8000,
				panelClass: ["message-snackbar"]
			});
		}
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.Progress(false);
		this.password_visible = false;
	}

	/**
	 *
	 */
	public onAccept(): void {
		this.Progress(true);
		this.auth.withdraw((error: IErrorObject, result: any): void => {
			if (!error) {
				this.matDialogRef.close(this.data);
			} else {
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

}
