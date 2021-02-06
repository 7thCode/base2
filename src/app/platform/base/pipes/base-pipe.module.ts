/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {AuthcolorPipe} from "./authcolor.pipe";
import {ToFixedPipe} from "./tofixed.pipe";
import {TruncatePipe} from "./truncate.pipe";
import {ShortnamePipe} from "./shortname.pipe";
import {AuthisPipe} from "./authis.pipe";
import {StripHtmlPipe} from "./strip-html.pipe";

@NgModule({
	declarations: [
		AuthcolorPipe,
		ShortnamePipe,
		TruncatePipe,
		ToFixedPipe,
		AuthisPipe,
		StripHtmlPipe
	],
	imports: [
		CommonModule
	],
	exports: [
		AuthcolorPipe,
		ShortnamePipe,
		TruncatePipe,
		ToFixedPipe,
		AuthisPipe,
		StripHtmlPipe
	],
	providers: [],
	bootstrap: [],
})

export class BasePipeModule {

}
