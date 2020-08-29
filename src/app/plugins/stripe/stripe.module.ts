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

import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatNativeDateModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {BaseModule} from "../../platform/base/base.module";

import {StripeComponent} from "./stripe.component";
import {StripeCardCreateDialogComponent} from "./stripe-card-create-dialog/stripe-card-create-dialog.component";
import {StripeCustomerUpdateDialogComponent} from "./stripe-customer-update-dialog/stripe-customer-update-dialog.component";

import {SessionService} from "../../platform/base/services/session.service";
import {StripeService} from "./stripe.service";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
	declarations: [
		StripeComponent,
		StripeCardCreateDialogComponent,
		StripeCustomerUpdateDialogComponent,
	],
	providers: [
		SessionService,
		StripeService,
	],
	imports: [
		CommonModule,
		FormsModule,

		FlexLayoutModule,

		MatDialogModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatListModule,
		MatCheckboxModule,
		MatSelectModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSlideToggleModule,
		MatGridListModule,

		BaseModule,
		MatTooltipModule,
	],
	exports: [
		StripeComponent,
	],
	bootstrap: [
		StripeCardCreateDialogComponent,
	],
})

export class StripeModule {
}
