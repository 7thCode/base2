/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import { Injectable } from "@angular/core";
import {InteractionChannel} from "../library/channel";

/*
*
* 送り側
*
* constructor(private interactionService: InteractionService)
*
* 		this.channel = this.interactionService.getChannel("channel-name");
* 		this.channel.publish(data: any);
*
*
* 受け側
*
* constructor(private interactionService: InteractionService)
*
* 		this.channel = this.interactionService.getChannel("channel-name");
*		this.channel.subscribe((data: any) => this.handler(data: any));
*
*/

@Injectable({
	providedIn: "root",
})

export class InteractionService {

	private channels: any = {};

	public getChannel(name: string): InteractionChannel {
		let result: InteractionChannel = this.channels[name];
		if (!result) {
			result = new InteractionChannel();
			this.channels[name] = result;
		}
		return result;
	}

	public deleteChannel(name: string): void {
		delete this.channels[name];
	}
}
