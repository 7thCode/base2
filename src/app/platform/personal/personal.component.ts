/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Input, OnInit} from '@angular/core';
import {SessionableComponent} from "../base/components/sessionable.component";
import {SessionService} from "../base/services/session.service";
import {AccountsService} from "../accounts/accounts.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Callback, IErrorObject} from "../../../../types/platform/universe";
import {Spinner} from "../base/library/spinner";
import {Overlay} from "@angular/cdk/overlay";

@Component({
	selector: 'app-personal',
	templateUrl: './personal.component.html',
	styleUrls: ['./personal.component.css']
})
export class PersonalComponent extends SessionableComponent implements OnInit {

	public create: Date;
	public username: string;
	public provider: string;

	private spinner: Spinner;

	@Input() public nickname: string;
	@Input() public description: string;
	@Input() public id: string;
	@Input() public image: string;
	@Input() public mails: string[];

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param accountService
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		private accountService: AccountsService,
		private matDialog: MatDialog,
		private snackbar: MatSnackBar,
	) {
		super(session);
		this.mails = [];
		this.spinner = new Spinner(overlay);
	}

	/**
	 * @param value
	 */
	private Progress(value: boolean): void {
		this.spinner.Progress(value);
	}

	/**
	 * アカウント参照
	 * @param callback
	 */
	private get(callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.get_self((error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * アカウント更新
	 * @param data
	 * @param callback
	 */
	private put(data: object, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.put_self(data, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * エラー表示
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 8000,
			});
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
				duration: 8000,
				panelClass: ["message-snackbar"]
			});
		}
	}

	public ngOnInit(): void {
		this.getSession((error: IErrorObject, session: any): void => {
			if (!error) {
				this.create = session.create;
				this.username = session.username;
		// 		this._auth = session.auth;
				this.get((error: IErrorObject, content: any): void => {
					if (!error) {
						this.nickname = content.nickname;
						this.description = content.description;
						this.id = content.id;
						this.mails = content.mails;
					} else {
						this.errorBar(error);
					}
				});
			} else {
				this.errorBar(error);
			}
		});
	}

	public onAccept() {
		const content = {
			nickname: this.nickname,
			description: this.description,
			id: this.id,
			mails: this.mails
		}
		this.put(content, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.messageBar("Done.");
			} else {
				this.errorBar(error);
			}
		});
	}
}
