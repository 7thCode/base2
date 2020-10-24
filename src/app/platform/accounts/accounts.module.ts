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

import {BasePipeModule} from "../base/pipes/base-pipe.module";
import {BaseModule} from "../base/base.module";
import {ImageModule} from "../image/image.module";

import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {AccountsComponent} from "./accounts.component";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";

import {SessionService} from "../base/services/session.service";
import {AccountsService} from "./accounts.service";
import {AuthModule} from "../auth/auth.module";

@NgModule({
	declarations: [
		AccountsComponent,
		AccountDialogComponent,
		RegistDialogComponent,
	],
	providers: [
		SessionService,
		AccountsService,
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
	 	MatGridListModule,
	 	MatPaginatorModule,
	 	MatSlideToggleModule,

		ImageModule,
		BasePipeModule,
		BaseModule,
		AuthModule,

	],
	exports: [
		AccountsComponent,
	],
	bootstrap: [
		AccountDialogComponent,
		RegistDialogComponent,
	],
})

export class AccountsModule {
}
