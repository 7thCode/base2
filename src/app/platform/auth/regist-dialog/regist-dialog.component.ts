/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, IErrorObject} from "../../../../../types/platform/universe";

import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BaseDialogComponent} from "../../base/components/base-dialog.component";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "regist-dialog",
	styleUrls: ["../auth.component.css"],
	templateUrl: "./regist-dialog.component.html",
})
export class RegistDialogComponent extends BaseDialogComponent implements OnInit {

	public agree: boolean = false;

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/**
	 *
	 */
	public completeMessage: string = "";

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 * @param snackbar
	 * @param auth
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<any>,
		public snackbar: MatSnackBar,
		public auth: AuthService,
		protected router: Router
	) {
		super();
	}

	/**
	 *
	 * @param error
	 */
	protected errorBar(error: IErrorObject): void {
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
	 *
	 */
	public ngOnInit(): void {
		this.Progress(false);
	}

	/**
	 *
	 */
	public changeAgree(event: any): void {
		this.agree = event.checked;
	}

	/**
	 *
	 */
	public onAccept(): void {
		this.Progress(true);
		const category: string = "";
		const type: string = "";
		const auth: number = AuthLevel.user;
		const metadata: any = {nickname: this.content.nickname, id: "1"};
		this.auth.regist(auth, this.content.username, this.content.password, category, type, metadata, (error: IErrorObject, result: any) => {
			if (!error) {
				this.matDialogRef.close(this.data);
			} else {
				this.errorBar(error);
			}
			this.Progress(false);
		});
	}

}
