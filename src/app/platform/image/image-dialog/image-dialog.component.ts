/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";

@Component({
	selector: "image-dialog",
	styleUrls: ["./image-dialog.component.css"],
	templateUrl: "./image-dialog.component.html",
})

/**
 * イメージダイアログ
 *
 */
export class ImageDialogComponent implements OnInit {

	/**
	 *
	 */
	@ViewChild(ImageCropperComponent, {static: true}) public imageCropper: ImageCropperComponent;

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
	public imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	/**
	 *
	 */
	public imageBase64() {
		let mime: string = "image/png";
		switch (this.extension(this.data.filename)) {
			case "jpg":
			case "jpeg":
				mime = "image/jpeg";
				break;
			case "png":
				mime = "image/png";
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
	public format() {
		let result: string = "png";
		switch (this.extension(this.data.filename)) {
			case "jpg":
			case "jpeg":
				result = "jpg";
				break;
			case "png":
				result = "png";
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
		this.imageCropper.rotateLeft();
	}

	/**
	 *
	 */
	public rotateRight(): void {
		this.imageCropper.rotateRight();
	}

	/**
	 *
	 */
	public flipHorizontal(): void {
		this.imageCropper.flipHorizontal();
	}

	/**
	 *
	 */
	public flipVertical(): void {
		this.imageCropper.flipVertical();
	}

	/**
	 *
	 * @param event
	 */
	public onRotate(event): void {
		this.imageCropper.rotateRight();
	}

}
