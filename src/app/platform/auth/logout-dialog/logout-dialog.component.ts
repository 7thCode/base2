/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";

import {Location} from "@angular/common";

import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";

import {IErrorObject} from "../../../../../types/platform/universe";
import {AuthService} from "../auth.service";

@Component({
	selector: "logout-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./logout-dialog.component.html",
	providers: [
		Location,
	],
})

/**
 *
 *
 * @since 0.01
 */
export class LogoutDialogComponent implements OnInit {

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 *
	 */
	public progress: boolean;

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
		public location: Location,
		public snackbar: MatSnackBar,
		public auth: AuthService) {
	}

	/**
	 *
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
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
	}

	/**
	 *
	 */
	public onAccept(): void {
		this.Progress(true);
		this.auth.logout((error: IErrorObject, result: any) => {
			if (!error) {
				this.matDialogRef.close(this.data);
				this.location.replaceState("");
			} else {
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

}
