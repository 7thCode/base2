/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
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
import {MailerComponent} from "./mailer/mailer.component";
import {ErrorComponent} from "./error/error.component";
import {NativeFilesComponent} from "../plugins/native-files/native-files.component";

const routes: Routes = [
	{
		path: "", component: PlatformComponent, children: [
			{path: "accounts", component: AccountsComponent, data: {animation: "accounts"}},
			{path: "articles", component: ArticlesComponent, data: {animation: "articles"}},
			{path: "files", component: FilesComponent, data: {animation: "files"}},
			{path: "pages", component: PagesComponent, data: {animation: "pages"}},
			{path: "personal", component: PersonalComponent, data: {animation: "personal"}},
			{path: "mailer", component: MailerComponent, data: {animation: "mailer"}},
			{path: "stripe", component: StripeComponent, data: {animation: "stripe"}},
			{path: "nativefiles", component: NativeFilesComponent, data: {animation: "nativefiles"}},
			{path: "", component: TopComponent, data: {animation: "top"}},
			{path: '**', component: ErrorComponent},
		],
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})

export class PlatformRoutingModule {
}
