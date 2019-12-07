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
import {GrabberModule} from "./grabber/grabber.module";
import {PlatformModule} from "./platform/platform.module";

import {AppComponent} from "./app.component";

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
		GrabberModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [
		MatSpinner,
	],
})

export class AppModule {
}
