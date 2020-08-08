/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {IErrorObject} from "../../../../../types/platform/universe";
import {AuthService} from "../auth.service";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "login-totp-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./login-totp-dialog.component.html",
})
export class LoginTotpDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 *
	 */
	public progress: boolean = false;

	/**
	 *
	 */
	public password_visible: boolean = false;

	// public emailFormControl = new FormControl("", [
	// 	Validators.required,
	// 	Validators.email,
	// ]);

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
	 * @param value
	 * @constructor
	 */
	public Progress(value: boolean): void {
		this.progress = value;
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
		this.auth.login_totp(this.content.username, this.content.password, this.content.code, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.matDialogRef.close(this.data);
			} else {
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

}
