/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {ApplicationComponent} from "./application.component";
import {TopComponent} from "./top/top.component";

const routes: Routes = [
	{path: "", component: ApplicationComponent, children: [
			{path: "", component: TopComponent, children: []},
		]},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})

export class ApplicationRoutingModule {
}
