/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";

import {TopComponent} from "./top.component";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
	declarations: [TopComponent],
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatButtonModule
	]
})

export class TopModule {
}
