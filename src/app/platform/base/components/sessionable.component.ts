/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject, IRole} from "../../../../../types/platform/universe";

import {ChangeDetectorRef, EventEmitter, Output} from "@angular/core";

import * as momentNs from "moment-timezone";

import {SessionService} from "../services/session.service";

const moment: any = momentNs;

/**
 * セッショナブルクラス
 *
 * @since 0.01
 */
export abstract class SessionableComponent {

	/**
	 * @returns 処理中か。
	 */
	protected get isProgress(): boolean {
		return this.progress;
	}

	/**
	 *  @returns 現行のセッション。
	 */
	public get currentSession(): any {
		return this.privateCurrentSession;
	}

	/**
	 * ロール取得
	 * @returns アカウントのロール
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

	/**
	 *
	 */
	// public get modifyMoment(): object {
	// 	let result: object = null;
	// 	if (this.privateCurrentSession) {
	// 		result = moment(this.privateCurrentSession.modify);
	// 	}
	// 	return result;
	// }

	/**
	 *
	 */
	public progress: boolean;

	/**
	 *
	 */
	@Output() public onProgress = new EventEmitter<boolean>();

	/**
	 *
	 */
	@Output() public complete = new EventEmitter<any>();

	/**
	 *
	 */
	private privateCurrentSession: any;

	/**
	 * @constructor
	 * @param session
	 * @param change
	 */
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

	/**
	 *
	 * @param type
	 * @param value
	 * @constructor
	 */
	protected Complete(type: string, value: any): void {
		this.complete.emit({type, value});
	}

	/**
	 * 動作中
	 * @param value 動作中
	 */
	protected Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	/**
	 * セッション取得
	 *
	 * @param callback コールバック
	 * @returns none なし
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
	 * セッションに任意のオブジェクト追加
	 *
	 * @param data 追加データ
	 * @param callback コールバック
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
