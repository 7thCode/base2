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

import {AuthService} from "../auth.service";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";
import {Router} from "@angular/router";

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
		public auth: AuthService,
		private router: Router) {
		super();
	}

	/**
	 *
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			if (error.code === 1) {
				this.router.navigate(['/']);
			} else {
				this.snackbar.open(error.message, "Close", {
					duration: 8000,
				});
			}
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
// 		duration: 8000,
				panelClass: ["message-snackbar"]
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
