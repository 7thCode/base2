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

import {BaseModule} from "../../platform/base/base.module";
import {ImageModule} from "../../platform/image/image.module";

import {NativeFilesComponent} from "./native-files.component";

import {SessionService} from "../../platform/base/services/session.service";


@NgModule({
	declarations: [
		NativeFilesComponent,
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
		NativeFilesComponent,
	],
	bootstrap: [
	],
})

export class NativeFilesModule {
}
