/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {MatButtonModule, MatCheckboxModule, MatDialogModule} from "@angular/material";

import {InfoDialogComponent} from "./components/info-dialog/info-dialog.component";
import {EqualsValidator} from "./directives/equals-validator.directive";
import {HighlightDirective} from "./directives/highlight.directive";

import {AuthcolorPipe} from "./pipes/authcolor.pipe";
import {ShortnamePipe} from "./pipes/shortname.pipe";

import {ProfileService} from "./services/profile.service";
import {PublicKeyService} from "./services/publickey.service";
import {SessionService} from "./services/session.service";

@NgModule({
	providers: [
		ProfileService,
		PublicKeyService,
		SessionService,
	],
	declarations: [
		ShortnamePipe,
		AuthcolorPipe,
		EqualsValidator,
		HighlightDirective,
		InfoDialogComponent,
	],
	imports: [

		FlexLayoutModule,

		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		FormsModule,
	],
	exports: [
		ShortnamePipe,
		AuthcolorPipe,
		EqualsValidator,
		HighlightDirective,
		InfoDialogComponent,
	],
	bootstrap: [
		InfoDialogComponent,
	],
})

export class BaseModule {
}
