/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

import {FlexLayoutModule} from "@angular/flex-layout";

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule, MatSpinner} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

import {AceEditorModule} from "ng2-ace-editor";

import {BasePipeModule} from "../platform/base/pipes/base-pipe.module";

import {AuthModule} from "../platform/auth/auth.module";
import {ErrorModule} from "../platform/error/error.module";
import {FilesModule} from "../platform/files/files.module";
import {ImageModule} from "../platform/image/image.module";

import {BlogRoutingModule} from "./blog-routing.module";
import {BlogTopModule} from "./top/top.module";
import {BlogDescriptionModule} from "./description/description.module";

import {BlogComponent} from "./blog.component";
import {ListComponent} from './list/list.component';
import {BlogArchiveModule} from "./archive/archive.module";

@NgModule({
	declarations: [
		BlogComponent,
		ListComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,

		FlexLayoutModule,

		MatTabsModule,
		MatCardModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatSidenavModule,
		MatSliderModule,
		MatMenuModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		MatInputModule,

		AceEditorModule,

		ErrorModule,
		AuthModule,
		ImageModule,
		FilesModule,

		BlogRoutingModule,
		BlogTopModule,
		BlogDescriptionModule,
		BlogArchiveModule,

		BasePipeModule,
	],
	providers: [],
	bootstrap: [BlogComponent],
	entryComponents: [MatSpinner],
})

export class BlogModule {
}
