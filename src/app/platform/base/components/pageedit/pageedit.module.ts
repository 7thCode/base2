import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {PageEditComponent} from "./pageedit.component";

import {ButtonComponent} from "./button/button.component";
import {CheckComponent} from "./check/check.component";
import {InputComponent} from "./input/input.component";
import {RadioComponent} from "./radio/radio.component";
import {SelectComponent} from "./select/select.component";
import {TextareaComponent} from "./textarea/textarea.component";

import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";

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
