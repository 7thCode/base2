/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";

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

import {AceEditorModule} from "ng2-ace-editor";

import {AccountsModule} from "./accounts/accounts.module";
import {ArticlesModule} from "./articles/articles.module";
import {AuthModule} from "./auth/auth.module";
import {ErrorModule} from "./error/error.module";
import {FilesModule} from "./files/files.module";
import {ImageModule} from "./image/image.module";
import {PagesModule} from "./pages/pages.module";
import {PlatformRoutingModule} from "./platform-routing.module";
import {PlatformComponent} from "./platform.component";
import {BasePipeModule} from "./base/pipes/base-pipe.module";
import { PersonalComponent } from './personal/personal.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

@NgModule({
	declarations: [
		PlatformComponent,
		PersonalComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		HttpClientModule,
		PlatformRoutingModule,

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
		AceEditorModule,

		ErrorModule,
		AccountsModule,
		ArticlesModule,
		PagesModule,
		AuthModule,
		ImageModule,
		FilesModule,
		BasePipeModule,
		MatFormFieldModule,
		FormsModule,
		MatInputModule,
	],
	providers: [],
	bootstrap: [PlatformComponent],
	entryComponents: [MatSpinner],
})

export class PlatformModule {
}
