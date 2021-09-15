/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
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
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'app-personal',
	templateUrl: './personal.component.html',
	styleUrls: ['./personal.component.css']
})

export class PersonalComponent extends SessionableComponent implements OnInit {

	public create: Date;
	public type: string;
	public username: string;
	public params: any = {};
	public from: any[] = [];
	public to: any[] = [];
	public from_user: any[] = [];
	public to_user: any[] = [];

	public relation_type: string = "friends";

	@Input() public nickname: string;
	@Input() public description: string;
	@Input() public id: string;
	@Input() public image: string;
	@Input() public mails: string[];

	private spinner: Spinner;

	/**
	 *
	 * @param session
	 * @param overlay
	 * @param accountService
	 * @param matDialog
	 * @param snackbar
	 * @param router
	 * @param route
	 */
	constructor(
		protected session: SessionService,
		protected overlay: Overlay,
		private accountService: AccountsService,
		private matDialog: MatDialog,
		private snackbar: MatSnackBar,
		private router: Router,
		protected route: ActivatedRoute,
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
	 * リレーション
	 * @param username
	 * @param type
	 * @param callback
	 */
	private makeRelation(username: string, type: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.make_relation(username, type, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * リレーション
	 * @param from
	 * @param to
	 * @param type
	 * @param callback
	 */
	private makeRelationTo(from: string, to: string, type: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.make_relation_to(from, to, type, (error: IErrorObject, result: object): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * リレーション削除
	 * @param username
	 * @param type
	 * @param callback
	 */
	private breakRelation(username: string, type: string, callback: Callback<object>): void {
		this.Progress(true);
		this.accountService.break_relation(username, type, (error: IErrorObject, result: object): void => {
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
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
				panelClass: ["message-snackbar"]
			});
		}
	}

	public ngOnInit(): void {
		this.getSession((error: IErrorObject, session: any): void => {
			if (!error) {
				this.create = session.create;
				this.username = session.username;
				this.route.queryParams.subscribe(params => {
					this.params = params;
					this.draw();
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

	public draw() {
		this.get((error: IErrorObject, content: any): void => {
			if (!error) {
				this.type = content.type;
				this.nickname = content.nickname;
				this.description = content.description;
				this.id = content.id;
				this.mails = content.mails;

				this.accountService.relation_from(this.relation_type, {}, (error, results) => {
					this.from = results;
					this.accountService.relation_to(this.relation_type, {}, (error, results) => {
						this.to = results;
					});
				});


				this.accountService.relation_from_user("oda.mikio+manager@gmail.com", this.relation_type, {}, (error, results) => {
					this.from_user = results;
					this.accountService.relation_to_user("oda.mikio+manager@gmail.com", this.relation_type, {}, (error, results) => {
						this.to_user = results;
					});
				});

			} else {
				this.errorBar(error);
			}
		});
	}

	public onMakeRelation(username: string): void {
		this.makeRelation(username, this.relation_type, () => {
			this.draw();
		});
	}

	public onMakeRelationTo(from: string, to: string): void {
		this.makeRelationTo(from, to, this.relation_type, () => {
			this.draw();
		});
	}

	public onBreakRelation(username: string): void {
		this.breakRelation(username, this.relation_type, () => {
			this.draw();
		});
	}
}
