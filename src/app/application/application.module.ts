import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ApplicationComponent} from "./application.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {PlatformRoutingModule} from "../platform/platform-routing.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSliderModule} from "@angular/material/slider";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatProgressSpinnerModule, MatSpinner} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AceEditorModule} from "ng2-ace-editor";
import {ErrorModule} from "../platform/error/error.module";
import {BasePipeModule} from "../platform/base/pipes/base-pipe.module";
import {TopModule} from "./top/top.module";
import {ApplicationRoutingModule} from "./application-routing.module";


@NgModule({
	declarations: [
		ApplicationComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		HttpClientModule,

		FlexLayoutModule,

		MatTabsModule,
		MatCardModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatSidenavModule,
		MatSliderModule,
		MatMenuModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		FormsModule,
		MatInputModule,
		AceEditorModule,

		ApplicationRoutingModule,
		ErrorModule,
		TopModule,
		BasePipeModule,
	],
	providers: [],
	bootstrap: [ApplicationComponent],
	entryComponents: [MatSpinner],
})
export class ApplicationModule {
}
