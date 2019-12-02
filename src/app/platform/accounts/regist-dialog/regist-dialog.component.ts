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

	public progress: boolean;

	public Progress(value: boolean): void {
		this.progress = value;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<RegistDialogComponent>) {
	}

	get user(): any {
		return this.data.user;
	}

	get role(): any {
		return this.data.user.role;
	}

	get content(): any {
		return this.data.content;
	}

	public ngOnInit(): void {
		this.Progress(false);
	}

	public cancel(): void {
		this.matDialogRef.close(null);
	}

	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

	public onProgressed(event): void {

	}

	public onUpdateAvatar(event): void {

	}

}
