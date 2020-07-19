/**
 * Copyright (c) 2019,2020 Kakusei
 */

"use strict";

import {NgModule} from "@angular/core";

import {AuthcolorPipe} from "./authcolor.pipe";
import {ToFixedPipe} from "./tofixed.pipe";
import {TruncatePipe} from "./truncate.pipe";
import {ShortnamePipe} from "./shortname.pipe";

@NgModule({
	declarations: [
		AuthcolorPipe,
		ShortnamePipe,
		TruncatePipe,
		ToFixedPipe
	],
	imports: [],
	exports: [
		AuthcolorPipe,
		ShortnamePipe,
		TruncatePipe,
		ToFixedPipe
	],
	providers: [],
	bootstrap: [],
})

export class BasePipeModule {

}
