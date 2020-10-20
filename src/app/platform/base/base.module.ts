/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";

import {InfoDialogComponent} from "./components/info-dialog/info-dialog.component";
import {YesNoDialogComponent} from "./components/yes-no-dialog/yes-no-dialog.component";
import {ResizeDialogComponent} from "../image/resize-dialog/resize-dialog.component";

import {EqualsValidator} from "./directives/equals-validator.directive";
import {HighlightDirective} from "./directives/highlight.directive";

import {ProfileService} from "./services/profile.service";
import {PublicKeyService} from "./services/publickey.service";
import {SessionService} from "./services/session.service";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";

@NgModule({
	providers: [
		ProfileService,
		PublicKeyService,
		SessionService,
	],
	declarations: [
		EqualsValidator,
		HighlightDirective,
		InfoDialogComponent,
		YesNoDialogComponent,
		ResizeDialogComponent
	],
	imports: [

		CommonModule,
		FlexLayoutModule,

		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		FormsModule,
		MatCardModule,
		MatSelectModule,
	],
	exports: [
		EqualsValidator,
		HighlightDirective,
		InfoDialogComponent,
		YesNoDialogComponent,
		ResizeDialogComponent
	],
	bootstrap: [
		InfoDialogComponent,
		YesNoDialogComponent,
		ResizeDialogComponent
	],
})

export class BaseModule {
}
