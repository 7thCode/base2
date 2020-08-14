/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AccountsComponent} from "./accounts/accounts.component";
import {ArticlesComponent} from "./articles/articles.component";
import {FilesComponent} from "./files/files.component";
import {PagesComponent} from "./pages/pages.component";
import {PlatformComponent} from "./platform.component";
import {TopComponent} from "./top/top.component";
import {PersonalComponent} from "./personal/personal.component";
import {StripeComponent} from "../plugins/stripe/stripe.component";

const routes: Routes = [
	{
		path: "platform", component: PlatformComponent, children: [
			{path: "", component: TopComponent},
			{path: "pages", component: PagesComponent},
			{path: "articles", component: ArticlesComponent},
			{path: "files", component: FilesComponent},
			{path: "accounts", component: AccountsComponent},
			{path: "personal", component: PersonalComponent},
			{path: "stripe", component: StripeComponent},
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})

export class PlatformRoutingModule {
}
