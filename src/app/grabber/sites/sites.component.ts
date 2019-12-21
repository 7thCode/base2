import {ChangeDetectorRef, Component, OnInit} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatSnackBar} from "@angular/material";

import {IArticleModelContent, IErrorObject} from "../../../../types/platform/universe";

import {ConstService} from "../../platform/base/services/const.service";
import {SessionService} from "../../platform/base/services/session.service";
import {SitesService} from "./sites.service";

import {GridViewComponent} from "../../platform/base/components/gridview.component";
import {ArticleDialogComponent} from "../../platform/articles/article-dialog/article-dialog.component";

@Component({
	selector: "app-sites",
	templateUrl: "./sites.component.html",
	styleUrls: ["./sites.component.css"],
})

export class SitesComponent extends GridViewComponent implements OnInit {

	public results: object[];

	public progress: boolean;

	public get isProgress(): boolean {
		return this.progress;
	}

	public Progress(value: boolean): void {
		this.progress = value;
		this.onProgress.emit(value);
	}

	protected service: SitesService;

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
		this.service = new SitesService(http, constService);
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public createDialog(): void {

		const initalData: IArticleModelContent = {
			id: "",
			parent_id: "",
			enabled: true,
			category: "",
			status: 0,
			type: "",
			name: "",
			value: {title: "", description: ""},
			accessory: {},
		};

		const dialog: any = this.matDialog.open(ArticleDialogComponent, {
			width: "40vw",
			data: {content: this.toView(initalData)},
			disableClose: true,
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				this.Progress(true);

				this.create(this.confirmToModel(result), (error: IErrorObject, result: any): void => {
					if (error) {
						this.Complete("error", error);
					}
					this.Progress(false);
				});
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});

	}
}
