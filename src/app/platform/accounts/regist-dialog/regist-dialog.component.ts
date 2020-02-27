/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";

@Component({
	selector: "regist-dialog",
	styleUrls: ["./regist-dialog.component.css"],
	templateUrl: "./regist-dialog.component.html",
})

/**
 * ユーザ登録ダイアログ
 *
 * @since 0.01
 */
export class RegistDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 * ユーザ
	 */
	get user(): any {
		return this.data.user;
	}

	/**
	 * ロール
	 */
	get role(): any {
		return this.data.user.role;
	}

	/**
	 * コンテント
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 * @constructor
	 *
	 * @param data
	 * @param matDialogRef
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<RegistDialogComponent>) {
		super();
	}


	/**
	 *
	 */
	public ngOnInit(): void {
		this.Progress(false);
	}

	/**
	 * キャンセル
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
