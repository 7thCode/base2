/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../../types/platform/universe";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BaseDialogComponent} from "../../base/components/base-dialog.component";
import {AuthService} from "../auth.service";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "regist-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./regist-dialog.component.html",
})
export class RegistDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 *
	 */
	public completeMessage: string;

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
		public matDialogRef: MatDialogRef<any>,
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
		const metadata: any = {nickname: this.content.nickname, id: "1"};
		this.auth.regist(this.content.username, this.content.password, metadata, (error: IErrorObject, result: any) => {
			if (!error) {
				this.matDialogRef.close(this.data);
			} else {
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

}
