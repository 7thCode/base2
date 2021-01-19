/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatPaginatorModule} from "@angular/material/paginator";
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
	// 	MatDatepickerModule,
	// 	MatNativeDateModule,
	 	MatInputModule,
	 	MatListModule,
	// 	MatGridListModule,
	// 	MatCheckboxModule,
	// 	MatSelectModule,
	// 	MatSnackBarModule,
	// 	MatFormFieldModule,
	 	MatExpansionModule,
	// 	MatAutocompleteModule,
	// 	MatProgressSpinnerModule,
	 	MatPaginatorModule,
	// 	MatSlideToggleModule,
	 	MatTabsModule,

		ImageModule,
		BasePipeModule,
		BaseModule,
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
