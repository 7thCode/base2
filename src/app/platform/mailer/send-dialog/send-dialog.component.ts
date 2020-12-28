/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {Component, Inject, NgZone, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {take} from "rxjs/operators";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "send-dialog",
	styleUrls: ["./send-dialog.component.css"],
	templateUrl: "./send-dialog.component.html",
})
export class SendDialogComponent {

	@ViewChild("autosize") public autosize: CdkTextareaAutosize;

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 * @param zone
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<SendDialogComponent>,
		private zone: NgZone) {
	}

	/**
	 *
	 */
	public triggerResize() {
		this.zone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
	}

	/**
	 *
	 */
	get content(): any {
		return this.data;
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
