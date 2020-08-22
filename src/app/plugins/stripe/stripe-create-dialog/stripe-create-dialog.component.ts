/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "stripe-create-dialog",
	styleUrls: ["./stripe-create-dialog.component.css"],
	templateUrl: "./stripe-create-dialog.component.html",
})
export class StripeCreateDialogComponent {

	// @ViewChild("autosize") public autosize: CdkTextareaAutosize;

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 * @param zone
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<StripeCreateDialogComponent>) {
	}

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 *
	 */
	public cancel(): void {
		this.matDialogRef.close(null);
	}

	/**
	 *
	 */
	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

}
