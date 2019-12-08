/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
	selector: "url-dialog",
	styleUrls: ["./url-dialog.component.css"],
	templateUrl: "./url-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class UrlDialogComponent implements OnInit {

	get content(): any {
		return this.data.content;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<UrlDialogComponent>) {
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
