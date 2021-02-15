/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Directive, Input, OnInit} from '@angular/core';
import {ResponsiveComponent} from "../../../platform/base/components/responsive.component";
import {BlogBaseService} from "../blog-base.service";
import {SessionService} from "../../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {IErrorObject} from "../../../../../types/platform/universe";

@Directive()
export class BlogBaseListComponent extends ResponsiveComponent implements OnInit {

	@Input() public type: string;

	public groups:{ _id: { yyyy: number, mm: number }, entries: [], count: number }[];

	protected service: BlogBaseService;

	constructor(
		protected session: SessionService,
		protected blogsService: BlogBaseService,
		protected breakpointObserver: BreakpointObserver,
	) {
		super(session, breakpointObserver);
		this.service = blogsService;
	}

	public ngOnInit(): void {
		this.group_by(this.type);
	}

	public group_by(type: string) {
		this.service.group_by(type, {}, {sort: {_id: 1}, limit: 20, skip: 0}, (error: IErrorObject, result: any) => {
			this.groups = result;
		});
	}
}
