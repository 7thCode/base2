import {NgModule} from "@angular/core";

import {ApplicationComponent} from "./application.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

import {MatSpinner} from "@angular/material/progress-spinner";

import {ErrorModule} from "../platform/error/error.module";
import {BasePipeModule} from "../platform/base/pipes/base-pipe.module";
import {TopModule} from "./top/top.module";
import {ApplicationRoutingModule} from "./application-routing.module";

@NgModule({
	declarations: [
		ApplicationComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		HttpClientModule,

		ApplicationRoutingModule,

		ErrorModule,
		TopModule,
		BasePipeModule,
	],
	providers: [],
	bootstrap: [ApplicationComponent],
	entryComponents: [MatSpinner],
})
export class ApplicationModule {
}
