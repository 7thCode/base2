/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
	selector: "regist-dialog",
	styleUrls: ["./regist-dialog.component.css"],
	templateUrl: "./regist-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class RegistDialogComponent implements OnInit {

	/**
	 *
	 */
	get user(): any {
		return this.data.user;
	}

	/**
	 *
	 */
	get role(): any {
		return this.data.user.role;
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
	public progress: boolean;

	/**
	 *
	 * @param data
	 * @param matDialogRef
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<RegistDialogComponent>) {
	}

	/**
	 *
	 * @param value
	 * @constructor
	 */
	public Progress(value: boolean): void {
		this.progress = value;
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.Progress(false);
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

	/**
	 *
	 * @param event
	 */
	public onProgressed(event): void {

	}

	/**
	 *
	 * @param event
	 */
	public onUpdateAvatar(event): void {

	}

}
