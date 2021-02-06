/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject} from "@angular/core";
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "stripe-card-create-dialog",
	styleUrls: ["./stripe-card-create-dialog.component.css"],
	templateUrl: "./stripe-card-create-dialog.component.html",
})
export class StripeCardCreateDialogComponent {

	public months = [
		 "1","2","3","4","5","6","7","8","9","10","11","12"
	]

	public years = [
		 "2020","2021","2022","2023","2024","2025"
	]

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 * @param zone
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<StripeCardCreateDialogComponent>) {
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
