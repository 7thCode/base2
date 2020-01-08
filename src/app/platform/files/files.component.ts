/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component, HostListener, OnChanges, OnInit, ViewChild} from "@angular/core";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {MatDialog, MatGridList, MatSnackBar} from "@angular/material";

import {UploadableComponent} from "../base/components/uploadable.component";
import {ConstService} from "../../config/const.service";
import {SessionService} from "../base/services/session.service";

@Component({
	selector: "files",
	templateUrl: "./files.component.html",
	styleUrls: ["./files.component.css"],
})

/**
 * @since 0.01
 */
export class FilesComponent extends UploadableComponent implements OnInit, OnChanges {

	public results: any[];
	protected query: object = {};
	protected page: number = 0;

	@ViewChild("fileInput", {static: true}) public fileInput;
	@ViewChild("grid", {static: true}) public grid: MatGridList;

	public filename: string = "";
	public size: number = 20;
	public count: number;

	public gridByBreakpoint: any = {xl: 8, lg: 6, md: 4, sm: 2, xs: 1};

	@HostListener("dragover", ["$event"])
	public onDragOver(event: any): void {
		event.preventDefault();
	}

	@HostListener("drop", ["$event"])
	public onDrop(event: any): void {
		event.preventDefault();
		const path: string = "";
		this.onFileDrop(path, this.marshallingFiles(event.dataTransfer.files));
	}

	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected constService: ConstService,
		protected change: ChangeDetectorRef,
		protected observableMedia: MediaObserver,
		protected matDialog: MatDialog,
		protected snackbar: MatSnackBar,
	) {
		super(session, http, constService, change);
	}

	/**
	 * @returns none
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		this.page = 0;
		this.query = {};
		this.results = [];

		this.draw((error: IErrorObject, filtered: any): void => {
			if (!error) {
				this.results = filtered;
			} else {
				this.Complete("error", error);
			}
		});
	}

	protected errorBar(error: IErrorObject): void {
		this.snackbar.open(error.message, "Close", {
			duration: 3000,
		});
	}

	/**
	 * @returns none
	 */
	public onFileDrop(path: string, files: any[]): void {
		if (files.length > 0) {
			this.Progress(true);
			this.uploadFiles(path, files, (error: IErrorObject, result: any): void => {
				if (!error) {
					this.draw((error, filtered) => {
						if (!error) {
							this.results = filtered;
							this.Complete("", filtered);
						} else {
							this.Complete("error", error);
						}
					});
				} else {
					this.Complete("error", error);
				}
				this.Progress(false);
			});
		}
		this.Progress(false);
	}

	/**
	 * @returns none
	 */
	public onClickFileInputButton(): void {
		this.fileInput.nativeElement.click();
	}

	/**
	 * @returns none
	 */
	public onChangeFileInput(): void {
		const files: any[] = this.fileInput.nativeElement.files;
		const path: string = "";
		this.onFileDrop(path, files);
	}

	/**
	 * @returns none
	 */
	public findByFilename(): void {
		this.query = {};
		this.page = 0;
		if (this.filename) {
			this.query = {filename: {$regex: this.filename}};
		}

		this.draw((error: IErrorObject, filtered: any): void => {
			if (!error) {
				this.results = filtered;
				this.Complete("", filtered);
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * @returns none
	 */
	protected getCategory(name: string, category: string): string {
		let result: string = "";
		if ((name === "avatar.jpg" || name === "blank.png")) {
			result = "l";
		}
		return result;
	}

	/**
	 * @returns none
	 */
	public ngOnChanges(changes: any): void {
	}

	/**
	 * @returns none
	 */
	public ngAfterContentInit(): void {
		this.observableMedia.media$.subscribe((change: MediaChange) => { // for responsive
			this.grid.cols = this.gridByBreakpoint[change.mqAlias];
		});
	}

	/**
	 * @returns none
	 */
	public onDelete(name: string): void {
		this.Progress(true);
		this.delete(name, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error, filtered) => {
					if (!error) {
						this.results = filtered;
						this.Complete("", filtered);
					} else {
						this.Complete("error", error);
					}
				});
			} else {
				this.Complete("error", error);
			}
			this.Progress(false);
		});
	}

	/**
	 * @returns none
	 */
	public draw(callback: Callback<any>): void {
		this.Progress(true);
		this.filesService.count({$and: [this.query, {"metadata.category": ""}]}, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.count = result.value;
				const option = {sort: {"content.start": -1}, skip: this.size * this.page, limit: this.size};
				this.filesService.query({$and: [this.query, {"metadata.category": ""}]}, option, (error: IErrorObject, results: any[]): void => {
					if (!error) {
						const filtered: any[] = [];
						results.forEach((result) => {
							result.cols = 1;
							result.rows = 1;
							result.type = 0;
							if (this.hasExtension({name: result.filename}, "jpg,jpeg,png,webp")) {
								result.type = 1;
							} else if (this.hasExtension({name: result.filename}, "svg")) {
								result.type = 2;
							} else if (this.hasExtension({name: result.filename}, "mpg,mp4,avi,mov,m4v,webm")) {
								result.type = 3;
							}
							result.extension = this.Extension({name: result.filename});

							filtered.push(result);
						});
						callback(null, filtered);
					} else {
						callback(error, null);
					}
				});
			} else {
				callback(error, null);
			}
			this.Progress(false);
		});
	}

	/**
	 * @returns none
	 */
	public Page(event): void {
		this.page = event.pageIndex;
		this.draw((error: IErrorObject, filtered: any): void => {
			if (!error) {
				this.results = filtered;
			} else {
				this.Complete("error", error);
			}
		});
	}

}
