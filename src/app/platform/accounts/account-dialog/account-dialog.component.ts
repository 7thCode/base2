/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, IErrorObject, IRole, ISession} from "../../../../../types/universe";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
	selector: "account-dialog",
	styleUrls: ["./account-dialog.component.css"],
	templateUrl: "./account-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class AccountDialogComponent implements OnInit {

	public qr: string = "";
	public is2fa: boolean;
	public enable: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<AccountDialogComponent>) {
	}

	/**
	 * @returns none
	 */
	public ngOnInit(): void {
		this.is2Fa();
	}

	get session(): ISession {
		return this.data.session;
	}

	get user(): any {
		return this.data.user;
	}

	get role(): any {
		return this.auth_to_role(this.data.user);
	}

	get content(): any {
		return this.data.content;
	}

	public cancel(): void {
		this.matDialogRef.close(null);
	}

	public onAccept(): void {
		this.data.service = null;
		this.matDialogRef.close(this.data);
	}

	private auth_to_role(user: { auth: number, provider: string }): IRole {
		let result: IRole = {
			login: false,
			system: false,
			manager: false,
			user: false,
			public: true,
			categoly: 0,
			raw: AuthLevel.public,
		};

		if (user) {
			const auth = user.auth;

			let categoly: number = 0;
			switch (user.provider) {
				case "local":
					categoly = 0;
					break;
				default:
					categoly = 1;
			}

			result = {
				system: (auth < AuthLevel.manager),
				manager: (auth < AuthLevel.user),
				user: (auth < AuthLevel.public),
				public: true,
				categoly,
				raw: auth,
				login: true,
			};
		}
		return result;
	}

	public is2Fa(): void {
		this.data.service.is_2fa(this.data.user.username, (error: IErrorObject, is2fa: any): void => {
			if (!error) {
				this.is2fa = is2fa;
			} else {

			}
		});
	}

	public onSet2Fa(): void {
		this.data.service.set_2fa(this.data.user.username, (error: IErrorObject, qr: any): void => {
			if (!error) {
				this.qr = qr;
				this.is2Fa();
			} else {

			}
		});
	}

	public onReset2Fa(): void {
		this.data.service.reset_2fa(this.data.user.username, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.qr = "";
				this.is2Fa();
			} else {

			}
		});
	}

	public onProgressed(event): void {

	}

	public onUpdateAvatar(event): void {

	}

}
