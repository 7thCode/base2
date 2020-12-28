/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import { environment } from '../../../../environments/environment';

import {HttpService} from "./http.service";
import {Injectable} from "@angular/core";

/**
 * 参照サービスのベースクラス
 *
 * @since 0.01
 */

export abstract class QueryableService extends HttpService {

	/**
	 * @constructor
	 * @param http HTTP
	 * @param model モデル名
	 */
	protected constructor(
		protected http: HttpClient,
		protected model: string,
	) {
		super(http);
	}

	/**
	 * クエリーオブジェクトに対するデコレーター
	 * 継承先でオーバーライドする
	 *
	 * @param value クエリーオブジェクト
	 * @return any デコレーテッド
	 */
	protected decorator(value: object): object {
		return value;
	}

	/**
	 * クエリー
	 *
	 * @param query MongoDBのクエリーオブジェクト
	 * @param option MongoDBのオプションオブジェクト
	 * @param callback 結果配列を返すコールバック
	 */
	public query(query: object, option: IQueryOption, callback: Callback<object[]>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.Encode(option, (error: IErrorObject, optionString: string): void => {
					if (!error) {
						this.http.get(this.endPoint + "/" + this.model + "/auth/query/" + queryString + "/" + optionString, this.httpOptions).pipe(retry(3)).subscribe((results: any): void => {
							if (results) {
								if (Array.isArray(results)) {
									const filterd: any[] = [];
									results.forEach((result) => {
										filterd.push(this.decorator(result));
									});
									callback(null, filterd);
								} else {
									callback({code: results.code, message: results.message + " 9674"}, []);
								}
							} else {
								callback(this.networkError, null);
							}
						}, (error: HttpErrorResponse): void => {
							callback({code: -1, message: error.message + " 918"}, []);
						});
					} else {
						callback({code: -1, message: "option parse error" + " 3319"}, []);
					}
				});
			} else {
				callback({code: -1, message: "query parse error" + " 7533"}, []);
			}
		});
	}

	/**
	 * カウント
	 *
	 * @param query MongoDBのクエリーオブジェクト
	 * @param callback 結果数を返すコールバック
	 */
	public count(query: object, callback: Callback<number>): void {
		this.Encode(query, (error: IErrorObject, queryString: string): void => {
			if (!error) {
				this.http.get(this.endPoint + "/" + this.model + "/auth/count/" + queryString, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
					if (result) {
						callback(null, result);
					} else {
						callback(this.networkError, 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback({code: -1, message: error.message + " 4557"}, null);
				});
			} else {
				callback({code: -1, message: "query parse error" + " 5201"}, null);
			}
		});
	}

	/**
	 * 単一のオブジェクトを返す
	 *
	 * @param id オブジェクトID
	 * @param callback オブジェクトを返すコールバック
	 */
	public get(id: string, callback: Callback<object>): void {
		this.http.get(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, this.decorator(result.value));
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message + " 8499"}, null);
		});
	}

}
