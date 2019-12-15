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
	MatSelectModule, MatSlideToggleModule,
	MatSnackBarModule,
} from "@angular/material";

import {SitesComponent} from "./sites.component";
import {SiteDialogComponent} from "./site-dialog/site-dialog.component";

@NgModule({
	declarations: [
		SitesComponent,
		SiteDialogComponent,
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
		MatSlideToggleModule,
	],
	exports: [

	],
	bootstrap: [
		SitesComponent,
		SiteDialogComponent,
	],
})

export class SitesModule {
}
