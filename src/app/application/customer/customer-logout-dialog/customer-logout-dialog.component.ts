/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {Component, Inject, OnInit} from "@angular/core";

import {Location} from "@angular/common";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {LogoutDialogComponent} from "../../../platform/auth/logout-dialog/logout-dialog.component";

import {AuthService} from "../../../platform/auth/auth.service";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "customer-logout-dialog",
	styleUrls: ["../customer.component.css"],
	templateUrl: "./customer-logout-dialog.component.html",
	providers: [
		Location,
	],
})
export class CustomerLogoutDialogComponent extends LogoutDialogComponent implements OnInit {

	/**
	 *
	 * @param data
	 * @param matDialogRef
	 * @param location
	 * @param snackbar
	 * @param auth
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<CustomerLogoutDialogComponent>,
		public location: Location,
		public snackbar: MatSnackBar,
		public auth: AuthService) {
		super(data, matDialogRef, location, snackbar, auth);
	}

}
