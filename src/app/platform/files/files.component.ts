/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {Component, HostListener, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {UploadableComponent} from "../base/components/uploadable.component";

import {SessionService} from "../base/services/session.service";
import {YesNoDialogComponent} from "../base/components/yes-no-dialog/yes-no-dialog.component";
import {Overlay} from "@angular/cdk/overlay";
import {Spinner} from "../base/library/spinner";
import {ResizeDialogComponent} from "../image/resize-dialog/resize-dialog.component";

/**
 * ファイル
 *
 * @since 0.01
 */
@Component({
	selector: "files",
	templateUrl: "./files.component.html",
	styleUrls: ["./files.component.css"],
})
export class FilesComponent extends UploadableComponent implements OnInit {

	public get isProgress(): boolean {
		return this.spinner.progress;
	}

	@ViewChild("fileInput") public fileInput: any;

	public results: any[] = [];

	public filename: string = "";
	public size: number = 20;
	public count: number = 0;

	public breakpoint: number = 4;

	protected query: object = {};
	protected page: number = 0;

	private spinner: Spinner;

	/**
	 *
	 * @param session
	 * @param http
	 * @param overlay
	 * @param matDialog
	 * @param snackbar
	 */
	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		private overlay: Overlay,
		private matDialog: MatDialog,
		private snackbar: MatSnackBar,
	) {
		super(session, http);
		this.spinner = new Spinner(overlay);
	}

	/**
	 *
	 * @param width
	 */
	private widthToColumns(width: number): number {
		let result: number = 4;
		if (width < 600) {
			result = 1;  // xs,
		} else if (width < 960) {
			result = 2;  // sm,
		} else if (width < 1280) {
			result = 4;  // md,
		} else if (width < 1920) {
			result = 6; // lg,
		} else {
			result = 8; // xl,
		}
		return result;
	}

	/**
	 *
	 * @param error
	 */
	private errorBar(error: IErrorObject): void {
		if (error) {
			this.snackbar.open(error.message, "Close", {
				duration: 8000,
			});
		}
	}

	/**
	 * メッセージ表示
	 * @param message
	 */
	private messageBar(message: string): void {
		if (message) {
			this.snackbar.open(message, "Close", {
				duration: 8000,
				panelClass: ["message-snackbar"]
			});
		}
	}

	/**
	 *
	 */
	protected Progress(value: boolean): void {
		this.spinner.Progress(value);
	}

	/**
	 *
	 * @param name 名前
	 * @param category カテゴリー
	 */
	protected getCategory(name: string, category: string): string {
		let result: string = "";
		if ((name === "avatar.jpg" || name === "blank.png")) {
			result = "l";
		}
		return result;
	}

	/**
	 *
	 * @param event ウィンドウイベント
	 */
	@HostListener("dragover", ["$event"])
	public onDragOver(event: any): void {
		event.preventDefault();
	}

	/**
	 *
	 * @param event ウィンドウイベント
	 */
	@HostListener("drop", ["$event"])
	public onDrop(event: any): void {
		event.preventDefault();
		const path: string = "";
		this.onFileDrop(path, this.marshallingFiles(event.dataTransfer.files));
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		this.page = 0;
		this.query = {};
		this.results = [];
		this.breakpoint = this.widthToColumns(window.innerWidth);

		this.draw((error: IErrorObject, results: object[] | null): void => {
			if (!error) {
				if (results) {
					this.results = results;
				} else {
					this.Complete("error", {code: -1, message: "error."});
				}
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 *
	 */
	public onResize(event: any): void {
		this.breakpoint = this.widthToColumns(event.target.innerWidth);
	}


	public Upload(path: string, files: any[]) {
		this.Progress(true);
		this.uploadFiles(path, files, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw((error, results) => {
					if (!error) {
						if (results) {
							this.results = results;
							this.Complete("", results);
						} else {
							this.Complete("error", {code: -1, message: "error."});
						}
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

	public resizeDialog(file: any, callback: (error: IErrorObject, result: any) => void): void {
		const resultDialogContent: any = {title: file.name, message: "size is " + file.size + "byte. upload it?", file: file};
		const dialog: MatDialogRef<any> = this.matDialog.open(ResizeDialogComponent, {
			width: "30%",
			minWidth: "320px",
			height: "fit-content",
			data: {
				session: this.currentSession,
				content: resultDialogContent,
			},
			disableClose: true,
		});

		dialog.afterOpened().subscribe((result: any): void => {

		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				callback(null, result.content.file);
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {
			this.Complete("", result);
		});
	}

	/*
*
* */
	public getImage(target_file: any, callback: (error: IErrorObject, result: any) => void): void {
		const reader = new FileReader();
		const image = new Image();
		reader.onload = (event) => {
			image.onload = () => {
				callback(null, image);
			}
			image.src = (event.target.result as string);
		}
		reader.readAsDataURL(target_file);
	}

	/**
	 * ファイルドロップハンドラー
	 * @param path パス
	 * @param files ファイルオブジェクト
	 */
	public onFileDrop(path: string, files: any[]): void {
		if (files.length > 0) {
			this.marshallingFiles(files).forEach((file, index) => {
					const type = this.mimeToType(file.type);
					switch (type) {  // resizeable?
						case "jpeg":
						case "png":
							this.getImage(file, (error, image) => {
								if (image.width > 1000) {
									this.resizeDialog(file, (error: IErrorObject, result: any) => {
										files[index] = result;
										this.Upload(path, files);
									});
								} else {
									this.Upload(path, files);
								}
							})
							break;
						default:
							this.Upload(path, files);
					}
				}
			);
		}
	}

	/**
	 *
	 */
	public onClickFileInputButton(): void {
		this.fileInput.nativeElement.click();
	}

	/**
	 *
	 */
	public onChangeFileInput(): void {
		const files: any[] = this.fileInput.nativeElement.files;
		const path: string = "";
		this.onFileDrop(path, files);
	}

	/**
	 *
	 */
	public findByFilename(): void {
		this.query = {};
		this.page = 0;


		if (this.filename) {
			this.query = {filename: {$regex: this.filename}};
		}

		this.draw((error: IErrorObject, results: object[] | null): void => {
			if (!error) {
				if (results) {
					this.results = results;
					this.Complete("", results);
				} else {
					this.Complete("error", {code: -1, message: "error."});
				}
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 * ファイル削除
	 * @param name
	 */
	public onDelete(event: MouseEvent, name: string): void {

		const _delete = (name: string): void => {
			this.Progress(true);
			this.delete(name, (error: IErrorObject, result: any): void => {
				if (!error) {
					this.draw((error, results) => {
						if (!error) {
							if (results) {
								this.results = results;
								this.Complete("", results);
							} else {
								this.Complete("error", {code: -1, message: "error."});
							}
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

		if (event.shiftKey) { // dialog?
			_delete(name);
		} else {
			const resultDialogContent: any = {title: "File", message: "Delete this?"};
			const dialog: MatDialogRef<any> = this.matDialog.open(YesNoDialogComponent, {
				width: "30%",
				minWidth: "320px",
				height: "fit-content",
				data: {
					session: this.currentSession,
					content: resultDialogContent,
				},
				disableClose: true,
			});
			dialog.afterClosed().subscribe((result: object) => {
				if (result) { // if not cancel then
					_delete(name);
				}
			});
		}

	}

	/**
	 * 再描画
	 * @param callback
	 */
	public draw(callback: Callback<object[]>): void {
		this.Progress(true);
		this.filesService.count({$and: [this.query, {"metadata.category": ""}]}, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.count = result.value;
				const option = {sort: {uploadDate: -1}, skip: this.size * this.page, limit: this.size};
				this.filesService.query({$and: [this.query, {"metadata.category": ""}]}, option, (error: IErrorObject, results: any[] | null): void => {
					if (!error) {
						const filtered: any[] = [];
						if (results) {
							results.forEach((result) => {
								result.cols = 1;
								result.rows = 1;
								result.type = 0;

								const type = this.mimeToType(result.metadata.type);
								switch (type) {
									case "jpg":
									case "jpeg":
									case "png":
									case "bmp":
									case "webp":
										result.type = 1;
										break;
									case "svg+xml":
										result.type = 2;
										break;
									case "mpg":
									case "mp4":
									case "avi":
									case "mov":
									case "m4v":
									case "webm":
										result.type = 3;
										break;
									default:
								}
								/*
								if (this.hasExtension({name: result.filename}, "jpg,jpeg,png,bmp,webp")) {
									result.type = 1;
								} else if (this.hasExtension({name: result.filename}, "svg")) {
									result.type = 2;
								} else if (this.hasExtension({name: result.filename}, "mpg,mp4,avi,mov,m4v,webm")) {
									result.type = 3;
								}
								*/
								result.extension = this.Extension({name: result.filename});

								filtered.push(result);
							});
						}
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
	 * ページ送り
	 * @param event
	 */
	public Page(event: any): void {
		this.page = event.pageIndex;
		this.draw((error: IErrorObject, results: object[] | null): void => {
			if (!error) {
				if (results) {
					this.results = results;
				} else {
					this.Complete("error", {code: -1, message: "error"});
				}
			} else {
				this.Complete("error", error);
			}
		});
	}

}
