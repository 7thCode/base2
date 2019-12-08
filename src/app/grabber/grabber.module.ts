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

import {GrabberRoutingModule} from "./grabber-routing.module";
import {GrabberComponent} from "./grabber.component";
import {ImagesModule} from "./images/images.module";

@NgModule({
	declarations: [
		GrabberComponent,
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

		GrabberRoutingModule,
		ImagesModule,
	],
	exports: [

	],
	bootstrap: [
		GrabberComponent,
	],
})

export class GrabberModule {
}