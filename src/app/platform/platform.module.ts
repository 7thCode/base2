/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatIconModule,
	MatListModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatSidenavModule,
	MatSliderModule,
	MatSnackBarModule,
	MatSpinner,
	MatTabsModule,
	MatToolbarModule,
} from "@angular/material";

import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";

import {AceEditorModule} from "ng2-ace-editor";

import {AccountsModule} from "./accounts/accounts.module";
import {ArticlesModule} from "./articles/articles.module";
import {AuthModule} from "./auth/auth.module";
import {ErrorModule} from "./error/error.module";
import {FilesModule} from "./files/files.module";
import {ImageModule} from "./image/image.module";
import {PagesModule} from "./pages/pages.module";
import {PlatformRoutingModule} from "./platform-routing.module";
import {VaultsModule} from "./vaults/vaults.module";

import {PlatformComponent} from "./platform.component";

@NgModule({
	declarations: [
		PlatformComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		HttpClientModule,
		PlatformRoutingModule,

		FlexLayoutModule,

		MatTabsModule,
		MatCardModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatSidenavModule,
		MatSliderModule,
		MatMenuModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		AceEditorModule,

		ErrorModule,
		AccountsModule,
		ArticlesModule,
		PagesModule,
		AuthModule,
		ImageModule,
		VaultsModule,
		FilesModule,

	],
	providers: [],
	bootstrap: [PlatformComponent],
	entryComponents: [MatSpinner],
})

export class PlatformModule {
}
