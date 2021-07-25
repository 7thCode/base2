/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject, IQueryOption} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {HttpService} from "./http.service";
import {Errors} from "../library/errors";

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
									callback(Errors.serverError(results, "A00183"), []);
								}
							} else {
								callback(Errors.networkError("A00184"), null);
							}
						}, (error: HttpErrorResponse): void => {
							callback(Errors.networkException(error, "A00185"), []);
						});
					} else {

						callback(Errors.responseError("A00186"), []);
					}
				});
			} else {
				callback(Errors.responseError("A00187"), []);
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
						callback(Errors.networkError("A00188"), 0);
					}
				}, (error: HttpErrorResponse): void => {
					callback(Errors.networkException(error, "A00189"), null);
				});
			} else {
				callback(Errors.responseError("A00190"), null);
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
					callback(Errors.serverError(result, "A00191"), null);
				}
			} else {
				callback(Errors.networkError("A00192"), null);
			}
		}, (error: HttpErrorResponse): void => {
			callback(Errors.networkException(error, "A00193"), null);
		});
	}

}
