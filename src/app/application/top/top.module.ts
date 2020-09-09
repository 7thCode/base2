/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TopComponent} from "./top.component";
import {CustomerModule} from "../customer/customer.module";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
	declarations: [TopComponent],
	imports: [
		CommonModule,
		CustomerModule,
		MatButtonModule,

	]
})
export class TopModule {
}
