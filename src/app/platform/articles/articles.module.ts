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
import {ArticleDialogComponent} from "./article-dialog/article-dialog.component";
import {ArticlesComponent} from "./articles.component";
import {ArticlesService} from "./articles.service";

@NgModule({
	declarations: [
		ArticlesComponent,
		ArticleDialogComponent,
	],
	providers: [
		SessionService,
		ArticlesService,
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
		MatSnackBarModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSlideToggleModule,

		BaseModule,
		MatGridListModule,
	],
	exports: [
		ArticlesComponent,
	],
	bootstrap: [
		ArticleDialogComponent,
	],
})

export class ArticlesModule {
}
