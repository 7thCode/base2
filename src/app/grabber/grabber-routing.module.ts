/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GrabberComponent} from "./grabber.component";
import {ImagesComponent} from "./images/images.component";
import {SitesComponent} from "./sites/sites.component";

const routes: Routes = [
	{
		path: "grabber", component: GrabberComponent, children: [
			{path: "sites", component: SitesComponent},
			{path: "images", component: ImagesComponent},
		],
	},
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})

export class GrabberRoutingModule {
}
