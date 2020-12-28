/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {FlexLayoutModule} from "@angular/flex-layout";

import {FormsModule} from "@angular/forms";
import {BaseModule} from "../base/base.module";

import {FragmentComponent} from "./fragment.component";

@NgModule({
	declarations: [
		FragmentComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
		BaseModule,
	],
	exports: [
		FragmentComponent,
	],
})

export class FragmentModule {
}
