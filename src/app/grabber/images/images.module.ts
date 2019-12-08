import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatDialogModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSelectModule,
	MatSnackBarModule,
} from "@angular/material";

import {ImagesComponent} from "./images.component";

import {FilepathPipe} from "../base/pipes/filepath.pipe";
import {UrlDialogComponent} from "./url-dialog/url-dialog.component";

@NgModule({
	declarations: [
		ImagesComponent,
		UrlDialogComponent,
		FilepathPipe,
	],
	imports: [
		CommonModule,
		FormsModule,

		FlexLayoutModule,

		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatDialogModule,
		MatNativeDateModule,
		MatInputModule,
		MatListModule,
		MatSelectModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,

		MatGridListModule,

	],
	exports: [
		FilepathPipe,
	],
	bootstrap: [
		ImagesComponent,
		UrlDialogComponent,
	],
})

export class ImagesModule {
}
