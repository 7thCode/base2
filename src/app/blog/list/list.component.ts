import {Component, OnInit} from '@angular/core';
import {BlogBaseListComponent} from "../../plugins/blog-base/blog-base-list/blog-base-list.component";
import {SessionService} from "../../platform/base/services/session.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {BlogService} from "../blog.service";

@Component({
	selector: 'blog-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent extends BlogBaseListComponent implements OnInit {

	public params: any = {};

	constructor(
		protected session: SessionService,
		protected blogsService: BlogService,
		protected breakpointObserver: BreakpointObserver,
	) {
		super(session, blogsService, breakpointObserver);
	}

	public ngOnInit(): void {
		super.ngOnInit();
	}

	public link(index: number): string {
		return "/blog/archive/" + this.type + "/" + index;
	}
}
