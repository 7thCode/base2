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

import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";


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
