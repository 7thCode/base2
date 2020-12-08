/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

import {FlexLayoutModule} from "@angular/flex-layout";

import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatSidenavModule} from "@angular/material/sidenav";

import {AceEditorModule} from "ngx-ace-editor-wrapper";

import {BasePipeModule} from "./base/pipes/base-pipe.module";

import {AccountsModule} from "./accounts/accounts.module";
import {ArticlesModule} from "./articles/articles.module";
import {AuthModule} from "./auth/auth.module";
import {ErrorModule} from "./error/error.module";
import {FilesModule} from "./files/files.module";
import {ImageModule} from "./image/image.module";
import {PagesModule} from "./pages/pages.module";
import {TopModule} from "./top/top.module";
import {PersonalModule} from "./personal/personal.module";
import {MailerModule} from "./mailer/mailer.module";
import {NativeFilesModule} from "../plugins/native-files/native-files.module";
import {StripeModule} from "../plugins/stripe/stripe.module";

import {PlatformRoutingModule} from "./platform-routing.module";

import {PlatformComponent} from "./platform.component";

@NgModule({
	declarations: [
		PlatformComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,

		FlexLayoutModule,

 		MatListModule,
 		MatIconModule,
 		MatButtonModule,
 		MatToolbarModule,
 		MatSidenavModule,
 		MatMenuModule,

		AceEditorModule,

		PlatformRoutingModule,
		ErrorModule,
		AccountsModule,
		ArticlesModule,
		PagesModule,
		AuthModule,
		ImageModule,
		FilesModule,
		PersonalModule,
		TopModule,

		StripeModule,
		MailerModule,
		NativeFilesModule,
		BasePipeModule,
	],
	providers: [],
	bootstrap: [PlatformComponent],
})

export class PlatformModule {
}
