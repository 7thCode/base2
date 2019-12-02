/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatSnackBarModule,
} from "@angular/material";

import {BaseModule} from "../base/base.module";
import {SessionService} from "../base/services/session.service";
import {ImageModule} from "../image/image.module";
import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {AccountsComponent} from "./accounts.component";
import {AccountsService} from "./accounts.service";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";

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

		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatListModule,
		MatGridListModule,
		MatCheckboxModule,
		MatSelectModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSlideToggleModule,

		BaseModule,
		ImageModule,
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
