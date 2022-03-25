/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {Component, HostListener, Input, OnChanges, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {UploadableComponent} from "../base/components/uploadable.component";
import {ImageDialogComponent} from "./image-dialog/image-dialog.component";

import {SessionService} from "../base/services/session.service";
import {ResizeDialogComponent} from "./resize-dialog/resize-dialog.component";
import {FilesService} from "../files/files.service";

/**
 * イメージ
 *
 * @since 0.01
 */
@Component({
	selector: "app-image",
	templateUrl: "./image.component.html",
	styleUrls: ["./image.component.css"],
})
export class ImageComponent extends UploadableComponent implements OnInit, OnChanges {

	@Input() public width: number = 0;
	@Input() public height: number = 0;
	@Input() public view: string = "";
	@Input() public type: string = "";
	@Input() public fileName: string = "";
	@Input() public username: string = "";
	@Input() public extensions: string = "";
	@Input() public scope: string = '';

	public endPoint: string;
	public style: any = null;
	public imagePath: string;
	public description: string;
	public resizeThreshold: any;

	/**
	 *
	 * @param session
	 * @param http
	 * @param matDialog
	 */
	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected matDialog: MatDialog,
	) {
		super(session);
		this.description = "";
		this.filesService = new FilesService(http);
		// 	this.endPoint = environment.endPoint;
		this.imagePath = this.endPoint + "/pfiles/get/blank.png";
		this.resizeThreshold = {width: 1000, height: 1000};
	}

	/**
	 *
	 * @param event
	 */
	private openUpdateDialog(event: object) {
		switch (this.view) {
			case "editable":
			case "rename":
				this.updateDialog(event);
				break;
			case "visible":
				break;
		}
	}

	/**
	 *
	 */
	private randamString(): string {
		return "" + Math.random();
	}

	/**
	 *
	 * @param name
	 */
	private draw(name: string): void {
		switch (this.scope) {
			case "publish":
				this.imagePath = this.endPoint + "/pfiles/get/" + encodeURIComponent(name) + "?u=" + encodeURIComponent(this.username) + "&r=" + this.randamString();
				break;
			case "":
				this.imagePath = this.endPoint + "/files/get/" + encodeURIComponent(name) + "?u=" + encodeURIComponent(this.username) + "&r=" + this.randamString();
				break;
			default:
		}
	}

	/**
	 *
	 * @param event
	 */
	@HostListener("dragover", ["$event"])
	public onDragOver(event: any): void {
		switch (this.view) {
			case "editable":
			case "rename":
				event.preventDefault();
				break;
			case "visible":
				break;
		}
	}

	/**
	 *
	 * @param event
	 */
	@HostListener("drop", ["$event"])
	public onDrop(event: any): void {
		const path: string = "";
		switch (this.view) {
			case "editable":
				event.preventDefault();
				this.onFileDrop(path, this.filterExtensionFiles(this.marshallingFiles(event.dataTransfer.files), this.extensions), false, event.shiftKey);
				break;
			case "rename":
				event.preventDefault();
				this.onFileDrop(path, this.filterExtensionFiles(this.marshallingFiles(event.dataTransfer.files), this.extensions), true, event.shiftKey);
				break;
			case "visible":
				break;
		}
	}

	/**
	 *
	 * @param event
	 */
	@HostListener("dblclick", ["$event"])
	public onDoubleClick(event: object): void {
		this.openUpdateDialog(event);
	}

	/**
	 *
	 * @param event
	 */
	@HostListener("press", ["$event"])
	public onPress(event: object): void {
		this.openUpdateDialog(event);
	}

	/**
	 *
	 * @param changes
	 */
	public ngOnChanges(changes: any): void {
		this.view = ImageComponent.defaultValue(changes.view, "visible");
		this.width = ImageComponent.defaultValue(changes.width, 120);
		this.height = ImageComponent.defaultValue(changes.height, 120);
		this.extensions = ImageComponent.defaultValue(changes.extensions, "jpg,jpeg,png,webp,avi,mp4,mov,webm,wmv,mpg,mkv,flv,asf");
		this.username = ImageComponent.defaultValue(changes.username, null);
		this.draw(this.fileName);
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		this.style = {
			"max-width": this.width + "px",
			"max-height": this.height + "px",
			"line-height": this.height + "px",
		};

		this.getSession((error: IErrorObject, session: any): void => {
			if (!error) {
				if (session) {
					if (!this.username) {
						this.username = session.username;
					}
				}
				this.draw(this.fileName);
			}
		});
	}

	/*
*
* */
	public resizeDialog(file: any, image: any, callback: Callback<any>): void {
		const resultDialogContent: any = {title: file.name, message: "size is " + file.size + "byte. upload it?", file: file, image: image};
		const dialog: MatDialogRef<any> = this.matDialog.open(ResizeDialogComponent, {
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

	// protected upload(name: string, url: string, category: string, params: any, callback: Callback<any>): void {
	// 	this.filesService.upload(name, category, params, url, callback);
	// }

	/**
	 *
	 * @param event
	 */
	public updateDialog(event: any): void {

		const dialog: MatDialogRef<any> = this.matDialog.open(ImageDialogComponent, {
			data: {content: event.target, filename: this.fileName},
			disableClose: true,
		});

		dialog.afterOpened().subscribe(() => {
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				switch (result.command) {
					case "cancel":
						break;
					case "update":
						this.filesService.upload(this.fileName, result.content, {category: "", description: ""}, {upsert: true}, (error: IErrorObject, result: any): void => {
							// 		this.upload(this.fileName, result.content, "", {upsert: true}, (error: IErrorObject, result: any): void => {
							if (!error) {
								this.draw(this.fileName);
								this.Complete("update", {name: this.fileName});
							} else {
								this.Complete("error", error);
							}
						});
						break;
					case "delete":
						this.delete(this.fileName, (error: IErrorObject, result: any): void => {
							if (!error) {
								this.Complete("delete", {name: this.fileName});
							} else {
								this.Complete("error", error);
							}
						});
						break;
				}
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {

		});

	}

	/*
	*
	* */
	public getImage(target_file: any, callback: Callback<any>): void {
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

	/*
	*
	* */
	public Upload(path: string, file: any) {
		this.uploadFile(file, path + this.fileName, {category: "", description: ""}, {upsert: false}, (error: IErrorObject, result: any): void => {
			if (!error) {
				this.draw(file.name);
				this.Complete("create", {name: file.name, type: file.type, size: file.size});
			} else {
				this.Complete("error", error);
			}
		});
	}

	/**
	 *
	 * @param path
	 * @param files
	 * @param rename
	 */
	public onFileDrop(path: string, files: File[], rename: boolean, escapeResize: boolean): void {
		if (files.length > 0) {
			const file = files[0];
			if (!rename) {
				this.fileName = file.name;
			}
			const type = this.mimeToType(file.type);
			switch (type) {  // resizeable?
				case "jpeg":
				case "png":
					if (!escapeResize) {
						this.getImage(file, (error: IErrorObject, image: any) => {
							if (!error) {
								if ((image.width > this.resizeThreshold.width) || (image.height > this.resizeThreshold.height)) {
									this.resizeDialog(file, image, (error: IErrorObject, result: any) => {
										this.Upload(path, result);
									});
								} else {
									this.Upload(path, file);
								}
							}
						})
					} else {
						this.Upload(path, file);
					}
					break;
				default:
					this.Upload(path, file);
			}
		}
	}
}
