/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {FlexLayoutModule} from "@angular/flex-layout";

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

import {BaseModule} from "../../platform/base/base.module";

import {NativeFileDialogComponent} from "./native-file-dialog/native-file-dialog.component";
import {NativeFilesComponent} from "./native-files.component";

import {SessionService} from "../../platform/base/services/session.service";
import {NativeFilesService} from "./native-files.service";


@NgModule({
	declarations: [
		NativeFilesComponent,
		NativeFileDialogComponent,
	],
	providers: [
		SessionService,
		NativeFilesService,
	],
	imports: [
		CommonModule,
		FormsModule,

		FlexLayoutModule,

 		MatDialogModule,
 		MatCardModule,
 		MatIconModule,
 		MatButtonModule,
 		MatInputModule,
 		MatPaginatorModule,
 		MatSlideToggleModule,
 		MatGridListModule,

		BaseModule,
	],
	exports: [
		NativeFilesComponent,
	],
	bootstrap: [
		NativeFileDialogComponent,
	],
})

export class NativeFilesModule {
}
