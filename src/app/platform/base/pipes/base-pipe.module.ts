/**
 * Copyright (c) 2019,2020 Kakusei
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {AuthcolorPipe} from "./authcolor.pipe";
import {ToFixedPipe} from "./tofixed.pipe";
import {TruncatePipe} from "./truncate.pipe";
import {ShortnamePipe} from "./shortname.pipe";
import {AuthisPipe} from "./authis.pipe";


@NgModule({
	declarations: [
		AuthcolorPipe,
		ShortnamePipe,
		TruncatePipe,
		ToFixedPipe,
		AuthisPipe
	],
	imports: [
		CommonModule
	],
	exports: [
		AuthcolorPipe,
		ShortnamePipe,
		TruncatePipe,
		ToFixedPipe,
		AuthisPipe
	],
	providers: [],
	bootstrap: [],
})

export class BasePipeModule {

}
