/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";

import {Callback, IContent, IErrorObject} from "../../../../../types/platform/universe";
import {SessionService} from "../services/session.service";
import {InfoDialogComponent} from "./info-dialog/info-dialog.component";
import {SessionableComponent} from "./sessionable.component";

/**
 * アップデータブルクラス
 *
 * @since 0.01
 */
export abstract class UpdatableComponent extends SessionableComponent implements OnInit {

	protected service: any;
	protected query: object = {};
	protected page: number = 0;

	public size: number = 20;
	public count: number;
	public results: any[];

	protected static defaultValue(change: any, defaultValue: any): any {
		let result: any = defaultValue;
		if (change) {
			result = change.currentValue;
		}
		return result;
	}

	protected constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected change: ChangeDetectorRef,
		protected matDialog: MatDialog
	) {
		super(session, change);
	}

	/**
	 * @returns none
	 */
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
	 * ドロー
	 * @params callback
	 * @returns none
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

	/**
	 * @returns none
	 */
	protected toListView(object: any): any {
		return object;
	}

	/**
	 * @returns none
	 */
	protected toView(data: any): any {
		return data;
	}

	/**
	 * @returns none
	 */
	protected confirmToModel(data: any): any {
		return data;
	}

	/**
	 *
	 * @params id
	 * @params callback
	 * @returns none
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
	 * @params callback
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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
	 * @returns none
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

}
