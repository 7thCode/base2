/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {RegistDialogComponent} from "../../../platform/auth/regist-dialog/regist-dialog.component";

import {AuthService} from "../../../platform/auth/auth.service";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "customer-regist-dialog",
	styleUrls: ["../customer.component.css"],
	templateUrl: "./customer-regist-dialog.component.html",
})
export class CustomerRegistDialogComponent extends RegistDialogComponent implements OnInit {

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 * @param snackbar
	 * @param auth
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<CustomerRegistDialogComponent>,
		public snackbar: MatSnackBar,
		public auth: AuthService) {
		super(data, matDialogRef, snackbar, auth);
	}

	public toNickname(): void {
		const names: string[] | null = this.content.username.split("@");
		if (names) {
			if (names.length > 0) {
				this.content.nickname = names[0];
			}
		}
	}
}
