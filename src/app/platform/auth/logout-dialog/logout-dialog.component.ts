/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";

import {IErrorObject} from "../../../../../types/universe";
import {AuthService} from "../auth.service";

@Component({
	selector: "logout-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./logout-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class LogoutDialogComponent implements OnInit {

	public progress: boolean;

	public Progress(value: boolean): void {
		this.progress = value;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<LogoutDialogComponent>,
		private snackbar: MatSnackBar,
		public auth: AuthService) {
	}

	get content(): any {
		return this.data.content;
	}

	public ngOnInit(): void {
		this.Progress(false);
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	public onAccept(): void {
		this.Progress(true);
		this.auth.logout((error: IErrorObject, result: any) => {
			if (!error) {
				this.matDialogRef.close(this.data);
			} else {
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

}
