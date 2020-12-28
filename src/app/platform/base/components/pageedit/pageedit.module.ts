/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {FlexLayoutModule} from "@angular/flex-layout";

import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";

import {PageEditComponent} from "./pageedit.component";

import {ButtonComponent} from "./button/button.component";
import {CheckComponent} from "./check/check.component";
import {InputComponent} from "./input/input.component";
import {RadioComponent} from "./radio/radio.component";
import {SelectComponent} from "./select/select.component";
import {TextareaComponent} from "./textarea/textarea.component";

@NgModule({
	declarations: [
		PageEditComponent,
		InputComponent,
		SelectComponent,
		RadioComponent,
		CheckComponent,
		ButtonComponent,
		TextareaComponent,
	],
	providers: [
	],
	imports: [
		FlexLayoutModule,
		CommonModule,
		FormsModule,
		MatInputModule,
		MatSelectModule,
		MatRadioModule,
		MatCheckboxModule,
		MatButtonModule,
		ReactiveFormsModule,
	],
	exports: [
		PageEditComponent,
	],
	bootstrap: [
	],
})

export class PageEditModule {
}
