/**
 * Copyright (c) 2019 Kakusei
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {LoginQrDialogComponent} from "../../../platform/auth/login-qr-dialog/login-qr-dialog.component";

import {AuthService} from "../../../platform/auth/auth.service";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "customer-login-qr-dialog",
	styleUrls: ["../customer.component.css"],
	templateUrl: "./customer-login-qr-dialog.component.html",
})
export class CustomerLoginQrDialogComponent extends LoginQrDialogComponent implements OnInit {

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
		public matDialogRef: MatDialogRef<CustomerLoginQrDialogComponent>,
		public snackbar: MatSnackBar,
		public auth: AuthService) {
		super(data, matDialogRef, snackbar, auth);
	}

}
