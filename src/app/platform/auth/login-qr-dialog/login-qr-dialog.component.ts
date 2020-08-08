/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../../types/platform/universe";

import {Component, Inject, Input, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {AuthService} from "../auth.service";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "login-qr-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./login-qr-dialog.component.html",
})
export class LoginQrDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 *
	 */
	public qr: string = "";

	/**
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
				duration: 0,
			});
		}
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.draw();
	}

	/**
	 *
	 */
	public draw(): void {
		this.auth.get_login_token((result: any): void => {
			this.qr = result;
		});
	}

}
