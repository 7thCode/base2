/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, OnInit} from '@angular/core';
import {SocketService} from "../base/services/socket.service";

/*
* */
@Component({
	selector: 'app-top',
	templateUrl: './top.component.html',
	styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

	message: string = '';
	packet: any = {message: 'Platform'};

	constructor(  private socket: SocketService) {
	}

	public ngOnInit(): void {
		this.socket.addMessageListener((name, event) => {
			if (name === 'message') {
				this.packet = JSON.parse(event.data);
				this.message = this.packet.message;
			}
		});
	}

	public send() {
		this.socket.request(JSON.stringify(this.packet));
	}

}
