/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "stripe-customer-update-dialog",
	styleUrls: ["./stripe-customer-update-dialog.component.css"],
	templateUrl: "./stripe-customer-update-dialog.component.html",
})
export class StripeCustomerUpdateDialogComponent implements OnInit {

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef

	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<StripeCustomerUpdateDialogComponent>,
	) {
	}

	/*
	*
	*/
	public ngOnInit(): void {
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
