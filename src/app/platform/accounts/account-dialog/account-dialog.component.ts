/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, IErrorObject, IRole, ISession} from "../../../../../types/platform/universe";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatDialogRef} from "@angular/material/dialog";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "account-dialog",
	styleUrls: ["./account-dialog.component.css"],
	templateUrl: "./account-dialog.component.html",
})
export class AccountDialogComponent extends BaseDialogComponent implements OnInit {

	get session(): ISession {
		return this.data.session;
	}

	get user(): any {
		return this.data.user;
	}

	get content(): any {
		return this.data.content;
	}

	public qr: string = "";
	public is2fa: boolean = false;
	public enable: boolean = false;

	/**
	 * @constructor
	 *
	 * @param data
	 * @param matDialogRef
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<AccountDialogComponent>) {
		super();
	}

	/**
	 * @returns none
	 */
	public ngOnInit(): void {
		this.is2Fa();
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
		this.data.service = null;
		this.matDialogRef.close(this.data);
	}

	/**
	 * ２要素認証か
	 */
	public is2Fa(): void {
		this.data.service.is_2fa(this.data.user.user_id, (error: IErrorObject, is2fa: any): void => {
			if (!error) {
				this.is2fa = is2fa;
			} else {

			}
		});
	}

	/**
	 * ２要素認証に
	 */
	public onSet2Fa(): void {
		this.data.service.set_2fa(this.data.user.username, (error: IErrorObject, qr: any): void => {
			if (!error) {
				this.qr = qr;
				this.is2Fa();
			} else {

			}
		});
	}

	/**
	 * ２要素認証解除
	 */
	public onReset2Fa(): void {
		this.data.service.reset_2fa(this.data.user.username, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.qr = "";
				this.is2Fa();
			} else {

			}
		});
	}

	/**
	 *
	 * @param event
	 */
	public onProgressed(event: any): void {

	}

	/**
	 *
	 * @param event
	 */
	public onUpdateAvatar(event: any): void {

	}

}
