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

import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {BaseModule} from "../../platform/base/base.module";

import {CustomerLoginDialogComponent} from "./customer-login-dialog/customer-login-dialog.component";
import {CustomerLoginDialogDirective} from "./customer-login-dialog/customer-login-dialog.directive";
import {CustomerLoginQrDialogComponent} from "./customer-login-qr-dialog/customer-login-qr-dialog.component";
import {CustomerLoginQrDialogDirective} from "./customer-login-qr-dialog/customer-login-qr-dialog.directive";
import {CustomerLoginTotpDialogComponent} from "./customer-login-totp-dialog/customer-login-totp-dialog.component";
import {CustomerLoginTotpDialogDirective} from "./customer-login-totp-dialog/customer-login-totp-dialog.directive";
import {CustomerLogoutDialogComponent} from "./customer-logout-dialog/customer-logout-dialog.component";
import {CustomerLogoutDialogDirective} from "./customer-logout-dialog/customer-logout-dialog.directive";
import {CustomerPasswordDialogComponent} from "./customer-password-dialog/customer-password-dialog.component";
import {CustomerPasswordDialogDirective} from "./customer-password-dialog/customer-password-dialog.directive";
import {CustomerRegistDialogComponent} from "./customer-regist-dialog/customer-regist-dialog.component";
import {CustomerRegistDialogDirective} from "./customer-regist-dialog/customer-regist-dialog.directive";

import {AuthService} from "../../platform/auth/auth.service";

@NgModule({
	declarations: [
		CustomerLoginDialogDirective,
		CustomerLoginQrDialogDirective,
		CustomerLoginTotpDialogDirective,
		CustomerRegistDialogDirective,
		CustomerPasswordDialogDirective,
		CustomerLogoutDialogDirective,
		CustomerLoginDialogComponent,
		CustomerLoginQrDialogComponent,
		CustomerLoginTotpDialogComponent,
		CustomerRegistDialogComponent,
		CustomerPasswordDialogComponent,
		CustomerLogoutDialogComponent,

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
		MatCardModule,
	],
	exports: [
		CustomerLoginDialogDirective,
		CustomerLoginQrDialogDirective,
		CustomerLoginTotpDialogDirective,
		CustomerRegistDialogDirective,
		CustomerPasswordDialogDirective,
		CustomerLogoutDialogDirective,
	],
	bootstrap: [
		CustomerLoginDialogComponent,
		CustomerLoginQrDialogComponent,
		CustomerLoginTotpDialogComponent,
		CustomerRegistDialogComponent,
		CustomerPasswordDialogComponent,
		CustomerLogoutDialogComponent,
	],
})

export class CustomerModule {
}
