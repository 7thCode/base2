/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {BaseDialogComponent} from "../../base/components/base-dialog.component";

/**
 * Vaultダイアログ
 *
 * @since 0.01
 */
@Component({
	selector: "vault-dialog",
	styleUrls: ["./vault-dialog.component.css"],
	templateUrl: "./vault-dialog.component.html",
})
export class VaultDialogComponent extends BaseDialogComponent {

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<VaultDialogComponent>) {
		super();
	}

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 * キャンセルクローズ
	 */
	public cancel(): void {
		this.matDialogRef.close(null);
	}

	/**
	 * アクセプトクローズ
	 * 値を返す
	 */
	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

}
