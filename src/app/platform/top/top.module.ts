/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
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
