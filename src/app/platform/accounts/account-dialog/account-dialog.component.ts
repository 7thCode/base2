/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, IErrorObject, ISession} from "../../../../../types/platform/universe";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

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

	get content(): any {
		return this.data.content;
	}

	get type(): string {
		return this.data.type;
	}

	set type(value: string) {
		this.data.type = value;
	}

	public auths: any[] = [
		{name: "System", value: AuthLevel.system},
		{name: "Manager", value: AuthLevel.manager},
		{name: "Common", value: AuthLevel.user},
		{name: "other", value: AuthLevel.public},
	];

	public types: any[] = [
		{name: "Manage", value: "manage"},
		{name: "General", value: "general"},
		{name: "other", value: "other"},
	];

	public qr: string = "";
	public is2fa: boolean = false;
	public enable: boolean = false;

	/**
	 * @constructor
	 *
	 * @param data
	 * @param matDialogRef
	 * @param snackbar
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<AccountDialogComponent>,
		public snackbar: MatSnackBar,
		private router: Router) {
		super();
	}

	/**
	 *
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			if (error.code === 1) {
				this.router.navigate(['/']);
			} else {
				this.snackbar.open(error.message, "Close", {
					duration: 8000,
				});
			}
		}
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
		this.data.service.is_2fa(this.content.user_id, (error: IErrorObject, is2fa: any): void => {
			if (!error) {
				this.is2fa = is2fa;
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * ２要素認証に
	 */
	public onSet2Fa(): void {
		this.data.service.set_2fa(this.content.username, (error: IErrorObject, qr: any): void => {
			if (!error) {
				this.qr = qr;
				this.is2Fa();
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * ２要素認証解除
	 */
	public onReset2Fa(): void {
		this.data.service.reset_2fa(this.content.username, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.qr = "";
				this.is2Fa();
			} else {
				this.errorBar(error);
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
