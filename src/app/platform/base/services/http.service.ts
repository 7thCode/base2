/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient, HttpHeaders} from "@angular/common/http";

import { environment } from '../../../../environments/environment';
import {Injectable} from "@angular/core";
import {Callback} from "../../../../../types/platform/universe";

/**
 * HTTPサービス
 *
 * ベースクラス。
 * 全てのHTTPクライアントはこのサービスを継承する。
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})
export abstract class HttpService {

	/**
	 * 共通エンドポイント
	 */
	public endPoint: string = "";

	/**
	 * 共通オプション
	 */
	protected httpOptions: any;

	/**
	 * 共通エラー
	 */
	protected networkError: any;

	/**
	 * @constructor
	 * @param http 基本HTTP
	 */
	constructor(
		protected http: HttpClient,
	) {
		this.endPoint = environment.endPoint;
		this.networkError = {code: 10000, message: "network error. 7461"};
		this.httpOptions = {
			headers: new HttpHeaders({
				"Accept": "application/json; charset=utf-8",
				"Content-Type": "application/json; charset=utf-8",
			}),
			withCredentials: true,
		};
	}

	/**
	 * URIストリングからオブジェクトにデシリアライズ
	 *
	 * @param data デシリアライズされるテキスト
	 * @param callback オブジェクトを返すコールバック
	 */
	protected Decode(data: string, callback:  Callback<any>): void {
		try {
			callback(null, JSON.parse(decodeURIComponent(data)));
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * オブジェクトからURIストリングシリアライズ
	 *
	 * @param data シリアライズされるオブジェクト
	 * @param callback シリアライズテキストを返すコールバック
	 */
	protected Encode(data: any, callback: Callback<any>): void {
		try {
			callback(null, encodeURIComponent(JSON.stringify(data)));
		} catch (error) {
			callback(error, "");
		}
	}

	/**
	 * エラー判定付きパース
	 *
	 * @param data　デシリアライズされるテキスト
	 * @param callback オブジェクトを返すコールバック
	 */
	protected Parse(data: string, callback: Callback<any>): void {
		try {
			callback(null, JSON.parse(data));
		} catch (error) {
			callback(error, null);
		}
	}

}
