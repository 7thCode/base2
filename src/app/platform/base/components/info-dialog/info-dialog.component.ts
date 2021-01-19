/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
	selector: "info-dialog",
	styleUrls: ["./info-dialog.component.css"],
	templateUrl: "./info-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class InfoDialogComponent implements OnInit {

	get content(): any {
		return this.data.content;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<InfoDialogComponent>) {

		if (!this.data.content.ok_button) {
			this.data.content.ok_button = "OK"
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
