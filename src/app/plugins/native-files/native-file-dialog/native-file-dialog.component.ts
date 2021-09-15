/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {Component, Inject, NgZone, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {take} from "rxjs/operators";
import {BaseDialogComponent} from "../../../platform/base/components/base-dialog.component";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "native-file-dialog",
	styleUrls: ["./native-file-dialog.component.css"],
	templateUrl: "./native-file-dialog.component.html",
})
export class NativeFileDialogComponent extends BaseDialogComponent {

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
		public matDialogRef: MatDialogRef<NativeFileDialogComponent>,
		private zone: NgZone) {
		super();
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
