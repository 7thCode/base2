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

import {IErrorObject} from "../../../../../types/platform/universe";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";
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
export class LogoutDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

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
		super();
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
