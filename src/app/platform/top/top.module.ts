/**
 * Copyright (c) 2019 Kakusei
 */

"use strict";

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";

import {TopComponent} from "./top.component";

@NgModule({
	declarations: [TopComponent],
	imports: [
		CommonModule,
		FlexLayoutModule
	]
})

export class TopModule {
}
