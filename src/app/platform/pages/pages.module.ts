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

import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatNativeDateModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

import {AngularEditorModule} from "@kolkov/angular-editor";
import {AceEditorModule} from "ng2-ace-editor";

import {BaseModule} from "../base/base.module";
import {PageEditModule} from "../base/components/pageedit/pageedit.module";

import {PageDialogComponent} from "./page-dialog/page-dialog.component";
import {PagesComponent} from "./pages.component";

import {SessionService} from "../base/services/session.service";
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
