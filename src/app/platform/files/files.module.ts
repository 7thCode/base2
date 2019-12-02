/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSelectModule,
} from "@angular/material";

import {FlexLayoutModule} from "@angular/flex-layout";

import {BaseModule} from "../base/base.module";
import {SessionService} from "../base/services/session.service";
import {ImageModule} from "../image/image.module";
import {FilesComponent} from "./files.component";

@NgModule({
	declarations: [
		FilesComponent,
	],
	providers: [
		SessionService,
	],
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatGridListModule,
		MatListModule,
		MatCheckboxModule,
		MatSelectModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		BaseModule,
		ImageModule,
	],
	exports: [
		FilesComponent,
	],
	bootstrap: [
	],
})

export class FilesModule {
}
