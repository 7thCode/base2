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

import {MatProgressSpinnerModule, MatSpinner} from "@angular/material/progress-spinner";

import {AppRoutingModule} from "./app-routing.module";
import {PlatformModule} from "./platform/platform.module";

import {AppComponent} from "./app.component";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

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
		ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [
		MatSpinner,
	],
})

export class AppModule {
}
