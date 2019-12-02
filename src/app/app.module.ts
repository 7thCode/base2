/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {OverlayModule} from "@angular/cdk/overlay";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {MatProgressSpinnerModule, MatSpinner} from "@angular/material";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {PlatformModule} from "./platform/platform.module";

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		MatProgressSpinnerModule,
		OverlayModule,
		PlatformModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [
		MatSpinner,
	],
})

export class AppModule {
}
