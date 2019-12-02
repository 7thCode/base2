/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {ChangeDetectorRef, EventEmitter, Output} from "@angular/core";

import * as momentNs from "moment-timezone";

import {AuthLevel, Callback, IRole, IErrorObject} from "../../../../../types/universe";
import {SessionService} from "../services/session.service";

const moment: any = momentNs;

/**
 * セッショナブルクラス
 *
 * @since 0.01
 */
export abstract class SessionableComponent {

	private privateCurrentSession: any;
	public progress: boolean;

	@Output() public onProgress = new EventEmitter<boolean>();
	@Output() public complete = new EventEmitter<any>();

	protected constructor(
		protected session: SessionService,
		protected change: ChangeDetectorRef,
	) {
		this.privateCurrentSession = {
			provider: "",
			username: "",
			user_id: "",
			content: {
				mails: [],
				nickname: "",
				id: "",
			},
			enabled: true,
			role: {},
		};
	}

	// event ~
	protected Complete(type: string, value: any): void {
		this.complete.emit({type, value});
	}

	protected Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	protected get isProgress(): boolean {
		return this.progress;
	}

	// ~ event

	public get currentSession(): any {
		return this.privateCurrentSession;
	}

	/**
	 * ロール取得
	 * @returns none
	 */
	public get role(): IRole {
		let result: IRole = {login: false, system: false, manager: false, user: false, public: false, categoly: 0, raw: AuthLevel.public};
		if (this.privateCurrentSession) {
			if (this.privateCurrentSession.role) {
				result = this.privateCurrentSession.role;
			}
		}
		return result;
	}

	public get modifyMoment(): object {
		let result: object = null;
		if (this.privateCurrentSession) {
			result = moment(this.privateCurrentSession.modify);
		}
		return result;
	}

	/**
	 * セッション取得
	 * @param callback
	 * @returns none
	 */
	protected getSession(callback: Callback<object>): void {
		this.session.get((error: IErrorObject, result: object): void => {
			if (!error) {
				this.privateCurrentSession = result;
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * @returns none
	 *
	 * data  session.data field
	 *
	 */
	protected putSessionData(data: object, callback: Callback<object>): void {
		this.session.put(data, (error: IErrorObject, result: object): void => {
			if (!error) {
				this.privateCurrentSession = result;
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

}
