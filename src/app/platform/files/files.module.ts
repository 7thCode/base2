/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
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
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";

import {BaseModule} from "../base/base.module";
import {ImageModule} from "../image/image.module";

import {FilesComponent} from "./files.component";

import {SessionService} from "../base/services/session.service";


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
 		MatInputModule,
 		MatGridListModule,
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
