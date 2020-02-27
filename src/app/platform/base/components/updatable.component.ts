/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IContent, IErrorObject} from "../../../../../types/platform/universe";

import {ChangeDetectorRef, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {InfoDialogComponent} from "./info-dialog/info-dialog.component";
import {SessionableComponent} from "./sessionable.component";

import {SessionService} from "../services/session.service";

/**
 * アップデータブルクラス
 *
 * @since 0.01
 */
export abstract class UpdatableComponent extends SessionableComponent implements OnInit {

	public size: number = 20;
	public count: number;
	public results: any[];

	protected service: any;
	protected query: object = {};
	protected page: number = 0;

	/**
	 * @constructor
	 * @param session
	 * @param change
	 * @param matDialog
	 */
	protected constructor(
		protected session: SessionService,
		protected change: ChangeDetectorRef,
		protected matDialog: MatDialog,
	) {
		super(session, change);
	}

	/**
	 *
	 * @param change
	 * @param defaultValue
	 */
	protected static defaultValue(change: any, defaultValue: any): any {
		let result: any = defaultValue;
		if (change) {
			result = change.currentValue;
		}
		return result;
	}

	/**
	 * インフォダイアログ
	 *
	 * @returns none
	 */
	protected infoDialog(title: string, message: string, callback: () => void): void {
		const dialog: any = this.matDialog.open(InfoDialogComponent, {
			data: {content: {title, message}},
			width: "90vw",
			height: "90vh",
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any): void => {
			callback();
		});
	}

	/**
	 * リストビューデコレータ
	 *
	 * @param object デコレーション対象
	 */
	protected toListView(object: any): any {
		return object;
	}

	/**
	 * ビューデコレータ
	 *
	 * @param data デコレーション対象
	 */
	protected toView(data: any): any {
		return data;
	}

	/**
	 * トランスフォーマー
	 * @param data トランスフォーム対象
	 */
	protected confirmToModel(data: any): any {
		return data;
	}

	/**
	 * 取得
	 * @params id 取得対象レコードID
	 * @params callback コールバック
	 * @returns none なし
	 */
	protected get(id: string, callback: Callback<any>): void {
		this.service.get(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				callback(null, result);
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * 作成
	 * @params data 初期データ
	 * @params callback コールバック
	 * @returns none なし
	 */
	protected create(content: IContent, callback: Callback<any>): void {
		this.service.post(content, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error: IErrorObject, result: any): void => {
					if (!error) {
						this.results = result;
						callback(null, result);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * 更新
	 *
	 * @param id 更新対象レコードID
	 * @param content 更新内容
	 * @param callback コールバック
	 */
	protected update(id: string, content: any, callback: Callback<any>): void {
		this.service.put(id, content, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error: IErrorObject, result: any): void => {
					if (!error) {
						this.results = result;
						callback(null, result);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * セット
	 *
	 * @param id 対象レコードID
	 * @param command　コマンド
	 * @param data 更新内容
	 * @param callback
	 */
	protected set(id: string, command: string, data: any, callback: Callback<any>): void {
		this.service.set(id, command, data, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error: IErrorObject, result: any): void => {
					if (!error) {
						this.results = result;
						callback(null, result);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * 削除
	 *
	 * @param id 対象レコードID
	 * @param callback コールバック
	 */
	protected delete(id: string, callback: Callback<any>): void {
		this.service.delete(id, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error: IErrorObject, result: any): void => {
					if (!error) {
						this.results = result;
						callback(null, result);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	public ngOnInit(): void {
		this.page = 0;
		this.query = {};
		this.results = [];
		this.getSession((error: IErrorObject, session: object): void => {
			this.draw((error: IErrorObject, filtered: object[]): void => {
				if (!error) {
					this.results = filtered;
					this.Complete("", filtered);
				} else {
					this.Complete("error", error);
				}
			});
		});
	}

	/**
	 * 再描画
	 * @param callback コールバック
	 */
	public draw(callback: Callback<any>): void {
		this.service.count(this.query, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.count = result.value;
				const option = {sort: {}, skip: this.size * this.page, limit: this.size};
				this.service.query(this.query, option, (error: IErrorObject, results: any[]): void => {
					if (!error) {
						const filtered: any[] = [];
						results.forEach((result: any): void => {
							filtered.push(this.toListView(result));
						});
						callback(null, filtered);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/**
	 * ページ送り
	 * @param event
	 * @constructor
	 */
	public Page(event): void {
		this.page = event.pageIndex;
		this.draw((error: IErrorObject, filtered: any): void => {
			if (!error) {
				this.results = filtered;
			} else {
				this.Complete("error", error);
			}
		});
	}

}
