/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {FlexLayoutModule} from "@angular/flex-layout";

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

import {PageEditModule} from "../base/components/pageedit/pageedit.module";
import {BaseModule} from "../base/base.module";
import {SessionService} from "../base/services/session.service";

import {PersonalComponent} from "./personal.component";

@NgModule({
	declarations: [
		PersonalComponent
	],
	providers: [
		SessionService,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		FlexLayoutModule,

 		MatCardModule,
 		MatButtonModule,
 		MatInputModule,

		PageEditModule,

		BaseModule,
	]
})

export class PersonalModule {
}
