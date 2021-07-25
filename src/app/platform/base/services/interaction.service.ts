/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Injectable} from "@angular/core";
import {InteractionChannel} from "../library/channel";


/**
 * 汎用ネームドイベントチャネル
 * 名前付きのチャネルを管理する。
 * チャネルはモジュール間でのイベント伝送に使用する単位。
 *
 * 送り側
 *
 * constructor(private interactionService: InteractionService)
 * this.channel = this.interactionService.getChannel("channel-name");
 * this.channel.publish(data: any);
 *
 *
 * 受け側
 *
 * constructor(private interactionService: InteractionService)
 * this.channel = this.interactionService.getChannel("channel-name");
 * this.channel.subscribe((data: any) => this.handler(data: any));
 *
 */

@Injectable({
	providedIn: "root",
})
export class InteractionService {

	/**
	 * チャネル
	 */
	private channels: any = {};

	/**
	 * チャネル参照・作成
	 * 当該チャネルがあれば返す。なければ生成。
	 *
	 * @param name チャネル名
	 * @return InteractionChannel 該当のチャネル
	 */
	public getChannel(name: string): InteractionChannel {
		let result: InteractionChannel = this.channels[name];
		if (!result) {
			result = new InteractionChannel();
			this.channels[name] = result;
		}
		return result;
	}

	/**
	 * 該当チャネル削除
	 *
	 * @param name
	 */
	public deleteChannel(name: string): void {
		delete this.channels[name];
	}
}
