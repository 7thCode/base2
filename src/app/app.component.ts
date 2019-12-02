/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, HostListener, OnInit} from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})

/**
 *
 * @since 0.01
 */

export class AppComponent implements OnInit {

	@HostListener("touchstart", ["$event"])
	public onTouchStart(event: any): void {
		if (event.touches.length >= 2) {
			event.preventDefault();
		}
	}

	private t = 0;
	@HostListener("touchend", ["$event"])
	public onTouchERnd(event: any): void {
		const now = new Date().getTime();
		if ((now - this.t) < 350) {
			event.preventDefault();
		}
		this.t = now;
	}

	constructor() {

	}

	public ngOnInit() {

	}

}
