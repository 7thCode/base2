/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IContent, IErrorObject} from "../../../../../types/platform/universe";

import {Directive, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {InfoDialogComponent} from "./info-dialog/info-dialog.component";
import {SessionableComponent} from "./sessionable.component";

import {SessionService} from "../services/session.service";
import {Errors} from "../library/errors";

/**
 * アップデータブルクラス
 *
 * @since 0.01
 */
@Directive()
export abstract class UpdatableComponent extends SessionableComponent implements OnInit {

	public size: number = 20;
	public count: number = 0;
	public results: any = [];

	protected service: any = null;
	protected query: object = {};
	protected sort: object = {};
	protected page: number = 0;

	/**
	 * @constructor
	 * @param session
	 * @param matDialog
	 */
	protected constructor(
		protected session: SessionService,
		protected matDialog: MatDialog,
	) {
		super(session);
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
	protected infoDialog(data: any, callback: (result: any) => void): void {
		const dialog: MatDialogRef<any> = this.matDialog.open(InfoDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: data,  // {content: {title, message}},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: any): void => {
			callback(result);
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
				this.draw((error: IErrorObject, result: object[] | null): void => {
					if (!error) {
						if (result) {
							this.results = result;
							callback(null, result);
						} else {
							callback(Errors.responseError("A00022"), null);
						}
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
				this.draw((error: IErrorObject, result: object[] | null): void => {
					if (!error) {
						if (result) {
							this.results = result;
							callback(null, result);
						} else {
							callback(Errors.networkError("A00023"), null);
						}
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
	 * @param command コマンド
	 * @param data 更新内容
	 * @param callback
	 */
	protected set(id: string, command: string, data: any, callback: Callback<any>): void {
		this.service.set(id, command, data, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error: IErrorObject, result: object[] | null): void => {
					if (!error) {
						if (result) {
							this.results = result;
							callback(null, result);
						} else {
							callback(Errors.networkError("A00024"), null);
						}
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
				this.draw((error: IErrorObject, result: object[] | null): void => {
					if (!error) {
						if (result) {
							this.results = result;
							callback(null, result);
						} else {
							callback(Errors.networkError("A00025"), null);
						}
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
		});
	}

	/*
	virtiual
	*/
	// protected Progress(value: boolean): void {
//
// 	 }

	public ngOnInit(): void {
		this.page = 0;
	 	this.query = {};
		this.results = [];
		this.getSession((error: IErrorObject, session: object | null): void => {
			if (!error) {
				this.draw((error: IErrorObject, results: object[] | null): void => {
					if (!error) {
						if (results) {
							this.results = results;
							this.Complete("", results);
						} else {
							this.Complete("error", Errors.generalError(-1, "error.", "A00026"));
						}
					} else {
						this.Complete("error", error);
					}
				});
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * 再描画
	 * @param callback コールバック
	 */
	public draw(callback: Callback<object[]>): void {
		this.service.count(this.query, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.count = result.value;
				const option: any = {sort: this.sort, skip: this.size * this.page, limit: this.size};
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
	public Page(event: any): void {
		this.page = event.pageIndex;
		this.draw((error: IErrorObject, results: object[] | null): void => {
			if (!error) {
				if (results) {
					this.results = results;
				} else {
					this.Complete("error", Errors.generalError(-1, "error.", "A00027"));
				}
			} else {
				this.Complete("error", error);
			}
		});
	}

}
