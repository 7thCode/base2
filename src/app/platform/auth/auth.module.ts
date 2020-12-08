/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {FlexLayoutModule} from "@angular/flex-layout";

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {BaseModule} from "../base/base.module";

import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {LoginDialogDirective} from "./login-dialog/login-dialog.directive";
import {LoginQrDialogComponent} from "./login-qr-dialog/login-qr-dialog.component";
import {LoginQrDialogDirective} from "./login-qr-dialog/login-qr-dialog.directive";
import {LoginTotpDialogComponent} from "./login-totp-dialog/login-totp-dialog.component";
import {LoginTotpDialogDirective} from "./login-totp-dialog/login-totp-dialog.directive";
import {LogoutDialogComponent} from "./logout-dialog/logout-dialog.component";
import {LogoutDialogDirective} from "./logout-dialog/logout-dialog.directive";
import {PasswordDialogComponent} from "./password-dialog/password-dialog.component";
import {PasswordDialogDirective} from "./password-dialog/password-dialog.directive";
import {RegistDialogComponent} from "./regist-dialog/regist-dialog.component";
import {RegistDialogDirective} from "./regist-dialog/regist-dialog.directive";

import {AuthService} from "./auth.service";

import {WithdrawDialogComponent} from "./withdraw-dialog/withdraw-dialog.component";
import {WithdrawDialogDirective} from "./withdraw-dialog/withdraw-dialog.directive";
import {UserNameDialogComponent} from "./username-dialog/username-dialog.component";
import {UserNameDialogDirective} from "./username-dialog/username-dialog.directive";
import {PasswordImmediateDialogComponent} from "./password-immediate-dialog/password-immediate-dialog.component";
import {PasswordImmediateDialogDirective} from "./password-immediate-dialog/password-immediate-dialog.directive";
import {UsernameImmediateDialogDirective} from "./username-immediate-dialog/username-immediate-dialog.directive";
import {UsernameImmediateDialogComponent} from "./username-immediate-dialog/username-immediate-dialog.component";
import {RemoveImmediateDialogDirective} from "./remove-immediate-dialog/remove-immediate-dialog.directive";
import {RemoveImmediateDialogComponent} from "./remove-immediate-dialog/remove-immediate-dialog.component";
import {RemoveDialogComponent} from "./remove-dialog/remove-dialog.component";
import {RemoveDialogDirective} from "./remove-dialog/remove-dialog.directive";

@NgModule({
	declarations: [
		LoginDialogDirective,
		LoginQrDialogDirective,
		LoginTotpDialogDirective,
		RegistDialogDirective,
		PasswordDialogDirective,
		PasswordImmediateDialogDirective,
		UserNameDialogDirective,
		UsernameImmediateDialogDirective,
		RemoveDialogDirective,
		RemoveImmediateDialogDirective,
		LogoutDialogDirective,
		WithdrawDialogDirective,
		LoginDialogComponent,
		LoginQrDialogComponent,
		LoginTotpDialogComponent,
		RegistDialogComponent,
		PasswordDialogComponent,
		PasswordImmediateDialogComponent,
		UserNameDialogComponent,
		UsernameImmediateDialogComponent,
		RemoveDialogComponent,
		RemoveImmediateDialogComponent,
		LogoutDialogComponent,
		WithdrawDialogComponent,

	],
	providers: [
		AuthService,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		FlexLayoutModule,

		MatCardModule,
		MatDividerModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatSelectModule,

		BaseModule,
	],
	exports: [
		LoginDialogDirective,
		LoginQrDialogDirective,
		LoginTotpDialogDirective,
		RegistDialogDirective,
		PasswordDialogDirective,
		PasswordImmediateDialogDirective,
		UserNameDialogDirective,
		UsernameImmediateDialogDirective,
		RemoveDialogDirective,
		RemoveImmediateDialogDirective,
		LogoutDialogDirective,
		WithdrawDialogDirective,
	],
	bootstrap: [
		LoginDialogComponent,
		LoginQrDialogComponent,
		LoginTotpDialogComponent,
		RegistDialogComponent,
		PasswordDialogComponent,
		PasswordImmediateDialogComponent,
		UserNameDialogComponent,
		UsernameImmediateDialogComponent,
		RemoveDialogComponent,
		RemoveImmediateDialogComponent,
		LogoutDialogComponent,
		WithdrawDialogComponent,
	],
})

export class AuthModule {
}
