/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {Component, Inject, OnInit} from "@angular/core";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {AuthService} from "../../../platform/auth/auth.service";
import {LoginTotpDialogComponent} from "../../../platform/auth/login-totp-dialog/login-totp-dialog.component";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "customer-login-totp-dialog",
	styleUrls: ["../customer.component.css"],
	templateUrl: "./customer-login-totp-dialog.component.html",
})
export class CustomerLoginTotpDialogComponent extends LoginTotpDialogComponent implements OnInit {

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
		public matDialogRef: MatDialogRef<CustomerLoginTotpDialogComponent>,
		public snackbar: MatSnackBar,
		public auth: AuthService) {
		super(data, matDialogRef, snackbar, auth);
	}

}
