/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
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
import {AuthModule} from "../auth/auth.module";

import {SessionService} from "../base/services/session.service";
import {AccountsService} from "./accounts.service";

import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {AccountsComponent} from "./accounts.component";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";

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
		MatOptionModule,
		MatSelectModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatDatepickerModule,

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
