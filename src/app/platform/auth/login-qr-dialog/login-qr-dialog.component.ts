/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../../types/universe";

import {Component, Inject, Input, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef, MatDividerModule, MatSnackBar} from "@angular/material";

import {AuthService} from "../auth.service";

@Component({
	selector: "login-qr-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./login-qr-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class LoginQrDialogComponent implements OnInit {

	public qr: string = "";

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<LoginQrDialogComponent>,
		private snackbar: MatSnackBar,
		public auth: AuthService) {
	}

	get content(): any {
		return this.data.content;
	}

	public ngOnInit(): void {
		this.draw();
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	public draw(): void {
		this.auth.get_login_token((result: any): void => {
			this.qr = result;
		});
	}

}
