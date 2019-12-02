import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {FlexLayoutModule} from "@angular/flex-layout";

import {FormsModule} from "@angular/forms";
import {BaseModule} from "../base/base.module";
import {FragmentComponent} from "./fragment.component";

@NgModule({
	declarations: [
		FragmentComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
		BaseModule,
	],
	exports: [
		FragmentComponent,
	],
})

export class FragmentModule {
}
