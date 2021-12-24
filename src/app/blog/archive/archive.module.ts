/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {RouterModule} from "@angular/router";

import {FlexModule} from "@angular/flex-layout";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {BasePipeModule} from "../../platform/base/pipes/base-pipe.module";
import {BlogRoutingModule} from "../blog-routing.module";

import {BlogArchiveComponent} from "./archive.component";
import {MatListModule} from "@angular/material/list";
import {ImageModule} from "../../platform/image/image.module";

@NgModule({
	declarations: [
		BlogArchiveComponent
	],
	imports: [
		CommonModule,
		FlexModule,
		RouterModule,

		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatRippleModule,
		ImageModule,

		BlogRoutingModule,

		BasePipeModule,
		MatListModule,
	],
	bootstrap: [
		BlogArchiveComponent,
	],
})

export class BlogArchiveModule {
}
