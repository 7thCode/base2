/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatDividerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	MatSnackBarModule,
} from "@angular/material";

import {BaseModule} from "../base/base.module";
import {AuthService} from "./auth.service";
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {LoginDialogDirective} from "./login-dialog/login-dialog.directive";
import {LoginTotpDialogComponent} from "./login-totp-dialog/login-totp-dialog.component";
import {LoginTotpDialogDirective} from "./login-totp-dialog/login-totp-dialog.directive";
import {LogoutDialogComponent} from "./logout-dialog/logout-dialog.component";
import {LogoutDialogDirective} from "./logout-dialog/logout-dialog.directive";
import {PasswordDialogComponent} from "./password-dialog/password-dialog.component";
import {PasswordDialogDirective} from "./password-dialog/password-dialog.directive";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";
import {RegistDialogDirective} from "./regist-dialog/regist-dialog.directive";

@NgModule({
	declarations: [
		LoginDialogDirective,
		LoginTotpDialogDirective,
		RegistDialogDirective,
		PasswordDialogDirective,
		LogoutDialogDirective,
		LoginDialogComponent,
		LoginTotpDialogComponent,
		RegistDialogComponent,
		PasswordDialogComponent,
		LogoutDialogComponent,

	],
	providers: [
		AuthService,
	],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,

		FlexLayoutModule,
		MatDividerModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatSelectModule,
		ReactiveFormsModule,
		BaseModule,
	],
	exports: [
		LoginDialogDirective,
		LoginTotpDialogDirective,
		RegistDialogDirective,
		PasswordDialogDirective,
		LogoutDialogDirective,
	],
	bootstrap: [
		LoginDialogComponent,
		LoginTotpDialogComponent,
		RegistDialogComponent,
		PasswordDialogComponent,
		LogoutDialogComponent,
	],
})

export class AuthModule {
}
