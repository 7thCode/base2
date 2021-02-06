/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {BaseDialogComponent} from "../../base/components/base-dialog.component";

/**
 * イメージダイアログ
 *
 */
@Component({
	selector: "image-dialog",
	styleUrls: ["./image-dialog.component.css"],
	templateUrl: "./image-dialog.component.html",
})
export class ImageDialogComponent extends BaseDialogComponent implements OnInit {

	/**
	 *
	 */
	@ViewChild(ImageCropperComponent) public imageCropper: ImageCropperComponent;

	/**
	 *
	 */
	public imageChangedEvent: any = "";

	/**
	 *
	 */
	public croppedImage: any = "";

	/**
	 *
	 */
	private canvas: any;

	/**
	 *
	 * @param data
	 * @param matDialogRef
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<ImageDialogComponent>) {
		super();
	}

	/**
	 *
	 * @param filename
	 */
	private extension(filename: string): string {
		let result: string = "";
		const fileExtension: any = filename.split(".");
		if (fileExtension.length >= 2) {
			result = fileExtension[fileExtension.length - 1];
		}
		return result.toLocaleLowerCase();
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.data.content.naturalWidth;
		this.canvas.height = this.data.content.naturalHeight;
		const context: any = this.canvas.getContext("2d");
		context.drawImage(this.data.content, 0, 0);
	}

	/**
	 *
	 * @param event
	 */
	public imageCropped(event: ImageCroppedEvent): any {
		this.croppedImage = event.base64;
	}

	/**
	 *
	 */
	public imageBase64(): string {
		let mime: string = "image/png";
		switch (this.extension(this.data.filename)) {
			case "jpg":
			case "jpeg":
				mime = "image/jpeg";
				break;
			case "png":
				mime = "image/png";
				break;
			case "bmp":
				mime = "image/bmp";
				break;
			case "webp":
				mime = "image/webp";
				break;
			default:
		}
		return this.canvas.toDataURL(mime);
	}

	/**
	 *
	 */
	public format(): string {
		let result: string = "png";
		switch (this.extension(this.data.filename)) {
			case "jpg":
			case "jpeg":
				result = "jpg";
				break;
			case "png":
				result = "png";
				break;
			case "bmp":
				result = "bmp";
				break;
			case "webp":
				result = "webp";
				break;
			default:
		}
		return result;
	}

	/**
	 *
	 */
	public imageLoaded() {
		// show cropper
	}

	/**
	 *
	 */
	public cropperReady() {
		// cropper ready
	}

	/**
	 *
	 */
	public loadImageFailed() {
		// show message
	}

	/**
	 *
	 */
	public cancel(): void {
		this.matDialogRef.close({command: "cancel", content: {}});
	}

	/**
	 *
	 */
	public onAccept(): void {
		this.matDialogRef.close({command: "update", content: this.croppedImage});
	}

	/**
	 *
	 */
	public rotateLeft(): void {
// 		this.imageCropper.rotateLeft();
	}

	/**
	 *
	 */
	public rotateRight(): void {
// 		this.imageCropper.rotateRight();
	}

	/**
	 *
	 */
	public flipHorizontal(): void {
// 		this.imageCropper.flipHorizontal();
	}

	/**
	 *
	 */
	public flipVertical(): void {
// 		this.imageCropper.flipVertical();
	}

	/**
	 *
	 * @param event
	 */
	public onRotate(event: any): void {
// 		this.imageCropper.rotateRight();
	}

}
