/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";

import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";

import {ImageCropperModule} from "ngx-image-cropper";

import {BaseModule} from "../base/base.module";

import {ImageDialogComponent} from "./image-dialog/image-dialog.component";
import {ImageComponent} from "./image.component";

@NgModule({
	declarations: [
		ImageComponent,
		ImageDialogComponent,
	],
	imports: [
		CommonModule,
		FormsModule,

		FlexLayoutModule,

	 	MatCardModule,
	 	MatDialogModule,

		ImageCropperModule,

		BaseModule,
	],
	exports: [
		ImageComponent,
	],
	bootstrap: [
		ImageDialogComponent,
	],
})

export class ImageModule {
}
