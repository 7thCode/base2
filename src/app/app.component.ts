/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {Component, HostListener, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from 'rxjs/operators';

import {environment} from '../environments/environment';

/**
 * アプリケーション
 * @since 0.01
 */
@Component({
	"selector": "app-root",
	"templateUrl": "./app.component.html",
	"styleUrls": ["./app.component.css"],
})

export class AppComponent implements OnInit {

	private t = 0;

	constructor(
		public router: Router,
		private route: ActivatedRoute,
		private title: Title,
		private meta: Meta
	) {
	}

	/**
	 * タッチタイミング
	 * @param event
	 */
	@HostListener("touchstart", ["$event"])
	public onTouchStart(event: any): void {
		if (event.touches.length >= 2) {
			event.preventDefault();
		}
	}

	/**
	 * タッチタイミング
	 * @param event
	 */
	@HostListener("touchend", ["$event"])
	public onTouchERnd(event: any): void {
		const now: number = new Date().getTime();
		if ((now - this.t) < 350) {
			event.preventDefault();
		}
		this.t = now;
	}

	public ngOnInit(): void {
		this.router.events.pipe( // SEO関連...
			filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
			const top_meta = environment.meta.top;
			this.setDescription(top_meta);
		});
	}

	public setDescription(meta: { title: string, description: any[] }): void {
		this.title.setTitle(meta.title);
		meta.description.forEach((each_description) => {
			this.meta.updateTag(each_description);
		})
	}

}
