/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ErrorComponent} from "./platform/error/error.component";

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./blog/blog.module').then((m) => {
			return m.BlogModule;
		})
	},
	{
		path: 'platform',
		loadChildren: () => import('./platform/platform.module').then((m) => {
			return m.PlatformModule;
		})
	},
	{path: '**', component: ErrorComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})

export class AppRoutingModule {
}
