/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
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

import {FlexLayoutModule} from "@angular/flex-layout";
import {BaseModule} from "../base/base.module";
import {SessionService} from "../base/services/session.service";
import {VaultDialogComponent} from "./vault-dialog/vault-dialog.component";
import {VaultsComponent} from "./vaults.component";
import {VaultsService} from "./vaults.service";

@NgModule({
	declarations: [
		VaultsComponent,
		VaultDialogComponent,
	],
	providers: [
		SessionService,
		VaultsService,
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
		MatCheckboxModule,
		MatSelectModule,
		MatGridListModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSlideToggleModule,

		BaseModule,
	],
	exports: [
		VaultsComponent,
	],
	bootstrap: [
		VaultDialogComponent,
	],
})

export class VaultsModule {
}
