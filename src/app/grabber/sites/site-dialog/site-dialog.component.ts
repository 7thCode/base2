/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {Component, Inject, NgZone, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {take} from "rxjs/operators";

@Component({
	selector: "site-dialog",
	styleUrls: ["./site-dialog.component.css"],
	templateUrl: "./site-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class SiteDialogComponent {

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<SiteDialogComponent>,
	) {
	}


	get content(): any {
		return this.data.content;
	}

	public cancel(): void {
		this.matDialogRef.close(null);
	}

	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

}
