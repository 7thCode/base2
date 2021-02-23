/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {RouterModule} from "@angular/router";

import {FlexModule} from "@angular/flex-layout";

import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";

import {AngularEditorModule} from "@kolkov/angular-editor";

import {ImageModule} from "../../platform/image/image.module";
import {BasePipeModule} from "../../platform/base/pipes/base-pipe.module";
import {BlogDialogComponent} from "../blog-dialog/blog-dialog.component";

import {BlogRoutingModule} from "../blog-routing.module";

import {BlogTopComponent} from "./top.component";

@NgModule({
	declarations: [
		BlogTopComponent,
		BlogDialogComponent
	],
	imports: [
		CommonModule,
		FlexModule,
		MatCardModule,
		MatPaginatorModule,
		MatButtonModule,
		MatIconModule,
		RouterModule,
		MatDialogModule,
		ImageModule,
		FormsModule,
		MatFormFieldModule,
		MatSelectModule,
		AngularEditorModule,
		MatSlideToggleModule,
		MatInputModule,

		BlogRoutingModule,
		BasePipeModule,
		MatRippleModule
	],
	bootstrap: [
		BlogTopComponent,
	],
})

export class BlogTopModule {
}
