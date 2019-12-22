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
import {AuthModule} from "../platform/auth/auth.module";
import {ErrorModule} from "../platform/error/error.module";
import {GrabberRoutingModule} from "./grabber-routing.module";
import {GrabberComponent} from "./grabber.component";
import {SitesModule} from "./sites/sites.module";
import {SrcsModule} from "./srcs/srcs.module";

@NgModule({
	declarations: [
		GrabberComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		HttpClientModule,
		GrabberRoutingModule,

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
		AuthModule,
		SitesModule,
		SrcsModule,

	],
	providers: [],
	bootstrap: [GrabberComponent],
	entryComponents: [MatSpinner],
})

export class GrabberModule {
}
