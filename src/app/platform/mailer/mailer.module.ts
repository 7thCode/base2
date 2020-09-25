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
import {MatTabsModule} from "@angular/material/tabs";

import {BasePipeModule} from "../base/pipes/base-pipe.module";
import {BaseModule} from "../base/base.module";
import {ImageModule} from "../image/image.module";

import {MailerComponent} from "./mailer.component";
import {ReplyDialogComponent} from "./reply-dialog/reply-dialog.component";
import {SendDialogComponent} from "./send-dialog/send-dialog.component";

import {SessionService} from "../base/services/session.service";
import {MailerService} from "./mailer.service";


@NgModule({
	declarations: [
		MailerComponent,
		ReplyDialogComponent,
		SendDialogComponent,
	],
	providers: [
		SessionService,
		MailerService,
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

		ImageModule,
		BasePipeModule,
		BaseModule,
		MatTabsModule,

	],
	exports: [
		MailerComponent,
	],
	bootstrap: [
		ReplyDialogComponent,
		SendDialogComponent,
	],
})

export class MailerModule {
}
