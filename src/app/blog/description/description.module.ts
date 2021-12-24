/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BlogDescriptionComponent} from "./description.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {ImageModule} from "../../platform/image/image.module";

@NgModule({
	declarations: [BlogDescriptionComponent],
	imports: [
		CommonModule,

		FlexLayoutModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		RouterModule,
		MatCardModule,

		ImageModule,
	]
})

export class BlogDescriptionModule {
}
