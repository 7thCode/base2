/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {ErrorComponent} from "../platform/error/error.component";
import {BlogComponent} from "./blog.component";
import {BlogTopComponent} from "./top/top.component";
import {BlogDescriptionComponent} from "./description/description.component";
import {BlogArchiveComponent} from "./archive/archive.component";

const routes: Routes = [
	{
		path: "", component: BlogComponent, children: [
			{path: "top", component: BlogTopComponent, data: {animation: "top"}},
			{path: "archive/:type/:skip", component: BlogArchiveComponent, data: {animation: 'archive'}},
			{path: 'description/:id', component: BlogDescriptionComponent, data: {animation: 'description'}},
			{path: "", component: BlogTopComponent, data: {animation: 'top'}},
			{path: '**', component: ErrorComponent},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})

export class BlogRoutingModule {
}
