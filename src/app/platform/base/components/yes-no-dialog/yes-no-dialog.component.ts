/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
	selector: "yes-no-dialog",
	styleUrls: ["./yes-no-dialog.component.css"],
	templateUrl: "./yes-no-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class YesNoDialogComponent implements OnInit {

	get content(): any {
		return this.data.content;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<YesNoDialogComponent>) {

		if (!this.data.content.ok_button) {
			this.data.content.ok_button = "OK"
		}

		 if (!this.data.content.cancel_button) {
		 	this.data.content.cancel_button = "Cancel"
		 }
	}

	public ngOnInit(): void {

	}

	public cancel(): void {
		this.matDialogRef.close(null);
	}

	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

}
