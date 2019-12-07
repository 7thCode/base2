import {ChangeDetectorRef, Component, OnInit} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {Callback, IErrorObject} from "../../../types/universe";

import {ConstService} from "../platform/base/services/const.service";
import {SessionService} from "../platform/base/services/session.service";
import {GrabberService} from "./grabber.service";

import {GridViewComponent} from "../platform/base/components/gridview.component";

@Component({
	selector: "app-grabber",
	templateUrl: "./grabber.component.html",
	styleUrls: ["./grabber.component.css"],
})

export class GrabberComponent extends GridViewComponent implements OnInit {

	public results: object[];

	public progress: boolean;

	public get isProgress(): boolean {
		return this.progress;
	}

	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	protected service: GrabberService;

	public alt = "";

	protected query: object = {};
	protected page: number = 0;
	public size: number = 20;
	public count: number;

	constructor(
		public session: SessionService,
		public constService: ConstService,
		protected http: HttpClient,
		public change: ChangeDetectorRef,
		public observableMedia: MediaObserver,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, http, change, matDialog, observableMedia);
		this.service = new GrabberService(http, constService);
	}


	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public findByAlt(): void {
		this.query = {};
		if (this.alt) {
			this.query = {"content.alt": {$regex: this.alt}};
		}
		this.draw((error: IErrorObject, accounts: object[]): void => {
			if (!error) {
				this.results = accounts;
			} else {
				this.errorBar(error);
			}
		});
	}

	/**
	 * @returns none
	 */
	protected toListView(object: any): any {
		object.cols = 1;
		object.rows = 1;
		return object;
	}

}
