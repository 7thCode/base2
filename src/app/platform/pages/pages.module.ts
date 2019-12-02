/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
	MatSlideToggleModule,
} from "@angular/material";

import {AngularEditorModule} from "@kolkov/angular-editor";
import {AceEditorModule} from "ng2-ace-editor";

import {BaseModule} from "../base/base.module";
import {PageEditModule} from "../base/components/pageedit/pageedit.module";
import {SessionService} from "../base/services/session.service";
import {PageDialogComponent} from "./page-dialog/page-dialog.component";
import {PagesComponent} from "./pages.component";
import {PagesService} from "./pages.service";

@NgModule({
	declarations: [
		PagesComponent,
		PageDialogComponent,
	],
	providers: [
		SessionService,
		PagesService,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		FlexLayoutModule,

		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatListModule,
		MatCheckboxModule,
		MatGridListModule,
		MatSelectModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		PageEditModule,
		MatSlideToggleModule,

		AceEditorModule,
		AngularEditorModule,
		BaseModule,
	],
	exports: [
		PagesComponent,
	],
	bootstrap: [
		PageDialogComponent,
	],
})

export class PagesModule {
}
