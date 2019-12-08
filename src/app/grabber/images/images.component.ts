import {ChangeDetectorRef, Component, OnInit} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {IErrorObject} from "../../../../types/universe";

import {ConstService} from "../../platform/base/services/const.service";
import {SessionService} from "../../platform/base/services/session.service";
import {ImagesService} from "./images.service";

import {GridViewComponent} from "../../platform/base/components/gridview.component";
import {UrlDialogComponent} from "./url-dialog/url-dialog.component";

@Component({
	selector: "app-images",
	templateUrl: "./images.component.html",
	styleUrls: ["./images.component.css"],
})

export class ImagesComponent extends GridViewComponent implements OnInit {

	public results: object[];

	public progress: boolean;

	public get isProgress(): boolean {
		return this.progress;
	}

	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	protected service: ImagesService;

	public src = "";
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
		this.service = new ImagesService(http, constService);
	}


	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public findBySrc(): void {
		this.query = {};
		this.page = 0;
		if (this.src) {
			this.query = {"content.src": {$regex: this.src}};
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
	public findByAlt(): void {
		this.query = {};
		this.page = 0;
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

	/**
	 * @returns none
	 */
	public urlDialog(image: any): void {
		const resultDialogContent: any = {
			src: image.src,
			alt: image.alt,
			url: image.url,
			description: image.description,
		};

		const dialog: any = this.matDialog.open(UrlDialogComponent, {
			width: "40vw",
			data: {
				session: this.currentSession,
				content: resultDialogContent,
			},
			disableClose: true,
		});

		dialog.afterClosed().subscribe((result: object) => {

		});
	}

}
