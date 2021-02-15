/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Injectable} from "@angular/core";
import {BlogBaseService} from "../plugins/blog-base/blog-base.service";

@Injectable({
	providedIn: "root",
})

export class BlogService extends BlogBaseService {

	// { _id: { yyyy: number, mm: number }, entries: [], count: number }
	protected decorator(group: any): any {
		return group;
	}

}
