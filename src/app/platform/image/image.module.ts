/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatProgressSpinnerModule,
	MatSelectModule,
} from "@angular/material";

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
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatListModule,
		MatGridListModule,
		MatCheckboxModule,
		MatSelectModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,

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
