/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {Component, HostListener, Input, OnChanges, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {UploadableComponent} from "../base/components/uploadable.component";
import {ImageDialogComponent} from "./image-dialog/image-dialog.component";

import { environment } from '../../../environments/environment';

import {SessionService} from "../base/services/session.service";

/**
 *　イメージ
 *
 * @since 0.01
 */
@Component({
	selector: "app-image",
	templateUrl: "./image.component.html",
	styleUrls: ["./image.component.css"],
})
export class ImageComponent extends UploadableComponent implements OnInit, OnChanges {

	// private results: any[];

	/**
	 *
	 */
	@Input() public width: number = 0;

	/**
	 *
	 */
	@Input() public height: number = 0;

	/**
	 *
	 */
	@Input() public view: string = "";

	/**
	 *
	 */
	@Input() public fileName: string = "";

	/**
	 *
	 */
	@Input() public user_id: string = "";

	/**
	 *
	 */
	@Input() public extensions: string = "";

	/**
	 *
	 */
	public endPoint: string = "";

	/**
	 *
	 */
	public style: any = null;

	/**
	 *
	 */
	public imagePath: string = "";

	/**
	 *
	 */
	public description: string = "";

	/**
	 *
	 * @param session
	 * @param http
	 * @param change
	 * @param matDialog
	 */
	constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected matDialog: MatDialog,
	) {
		super(session, http);
		this.description = "";
		this.endPoint = environment.endPoint;
		this.imagePath = this.endPoint + "/files/get/blank.png";
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
		this.imagePath = this.endPoint + "/files/get/" + encodeURIComponent(name) + "?u=" + encodeURIComponent(this.user_id) + "&r=" + this.randamString();
	}

	/**
	 *
	 * @param name
	 * @param category
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
				this.onFileDrop(path, this.filterExtensionFiles(this.marshallingFiles(event.dataTransfer.files), this.extensions), false);
				break;
			case "rename":
				event.preventDefault();
				this.onFileDrop(path, this.filterExtensionFiles(this.marshallingFiles(event.dataTransfer.files), this.extensions), true);
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
		this.extensions = ImageComponent.defaultValue(changes.extensions, "jpg");
		this.user_id = ImageComponent.defaultValue(changes.user_id, null);
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		this.style = {
			"width": this.width + "px",
			"height": this.height + "px",
			"line-height": this.height + "px",
		};

		this.getSession((error: IErrorObject, session: any): void => {
			if (session) {
				if (!this.user_id) {
					this.user_id = session.user_id;
				}
			}
			this.draw(this.fileName);
		});
	}

	/**
	 *
	 * @param path
	 * @param files
	 * @param rename
	 */
	public onFileDrop(path: string, files: File[], rename: boolean): void {
		if (files.length > 0) {
			if (!rename) {
				this.fileName = files[0].name;
			}
			this.Progress(true);
			this.uploadFile(files[0], path + this.fileName, (error: IErrorObject, result: any): void => {
				if (!error) {
					this.draw(this.fileName);
					this.Progress(false);
					this.Complete("create",  this.fileName);
				} else {
					this.Complete("error", error);
				}
				this.Progress(false);
			});
		}
	}

	/**
	 *
	 * @param event
	 */
	public updateDialog(event: any): void {

		this.Progress(true);
		const dialog: MatDialogRef<any> = this.matDialog.open(ImageDialogComponent, {
			data: {content: event.target, filename: this.fileName},
			disableClose: true,
		});

		dialog.afterOpened().subscribe(() => {
			this.Progress(false);
		});

		dialog.beforeClosed().subscribe((result: any): void => {
			if (result) { // if not cancel then
				switch (result.command) {
					case "cancel":
						break;
					case "update":
						this.Progress(true);
						this.upload(this.fileName, result.content, (error: IErrorObject, result: any): void => {
							if (!error) {
								this.draw(this.fileName);
								this.Complete("update", this.fileName);
							} else {
								this.Complete("error", error);
							}
							this.Progress(false);
						});
						break;
					case "delete":
						this.Progress(true);
						this.delete(this.fileName, (error: IErrorObject, result: any): void => {
							if (!error) {
								this.Complete("delete", this.fileName);
							} else {
								this.Complete("error", error);
							}
							this.Progress(false);
						});
						break;
				}
			}
		});

		dialog.afterClosed().subscribe((result: any): void => {

		});

	}

}
