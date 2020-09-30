/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AuthLevel, Callback, IErrorObject, IRole, ISession} from "../../../../../types/platform/universe";

import {Directive, EventEmitter, Output} from "@angular/core";

import {SessionService} from "../services/session.service";

/**
 * セッショナブルクラス
 *
 * @since 0.01
 */

@Directive()
export abstract class SessionableComponent {

	/**
	 * @returns 処理中か。
	 */
	// protected get isProgress(): boolean {
	// 	return this.progress;
	// }

	/**
	 *  @returns 現行のセッション。
	 */
	public get currentSession(): any {
		return this.privateCurrentSession;
	}

	/**
	 * authLevel
	 * @returns level
	 */
	 public get auth(): number {
	 	let result: number = AuthLevel.public;
	 	if (this.privateCurrentSession) {
	 		result = this.privateCurrentSession.auth;
	 	}
	 	return result;
	 }

	/**
	 * login
	 * @returns is Login
	 */
	public get login(): boolean {
		let result: boolean = false;
		if (this.privateCurrentSession) {
			result = this.privateCurrentSession.login;
		}
		return result;
	}

	/**
	 * プロバイダ取得
	 * @returns アカウントのロール
	 */
	public get provider(): string {
		let result: string = "";
		if (this.privateCurrentSession) {
			if (this.privateCurrentSession.provider) {
				result = this.privateCurrentSession.provider;
			}
		}
		return result;
	}

	/**
	 *
	 */
	// public progress: boolean = false;

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
	 */
	protected constructor(
		protected session: SessionService,
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
			login: false
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
	// protected Progress(value: boolean): void {
	// 	this.progress = value;
	// 	this.onProgress.emit(value);
	// }

	/**
	 * セッション取得
	 *
	 * @param callback コールバック
	 * @returns none なし
	 */
	protected getSession(callback: Callback<object>): void {
		this.session.get((error: IErrorObject, result: ISession): void => {
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
	protected putSessionData(data: object, callback: Callback<ISession>): void {
		this.session.put(data, (error: IErrorObject, results: ISession | null): void => {
			if (!error) {
				if (results) {
					this.privateCurrentSession = results;
					callback(null, results);
				} else {
					callback({code: -1, message:"error."}, null);
				}
			} else {
				callback(error, null);
			}
		});
	}

}
