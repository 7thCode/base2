/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

// import {AngularEditorModule} from "@kolkov/angular-editor";
import {AceEditorModule} from "ngx-ace-editor-wrapper";

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
 		MatDialogModule,
 		MatIconModule,
 		MatButtonModule,
 		MatInputModule,
 		MatGridListModule,
 		MatSelectModule,
 		MatPaginatorModule,
 		MatSlideToggleModule,

		AceEditorModule,
// 		AngularEditorModule,
		PageEditModule,

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
