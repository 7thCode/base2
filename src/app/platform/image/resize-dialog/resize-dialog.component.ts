/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
	selector: "resize-dialog",
	styleUrls: ["./resize-dialog.component.css"],
	templateUrl: "./resize-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class ResizeDialogComponent implements OnInit, AfterViewInit {

	public factor: string;

	public preview: any;
	public image_size: string;
	@ViewChild("preview", {read: ElementRef}) private preview_ref: ElementRef;

	private image: any = null;
	private canvas: any = null;
	private target_file: File = null;

	get content(): any {
		return this.data.content;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<ResizeDialogComponent>) {

		this.canvas = document.createElement("canvas");
		this.target_file = null;

		if (!this.data.content.cancel_button) {
			this.data.content.cancel_button = "Cancel"
		}
	}

	/*
	*
	* */
	public ngOnInit(): void {
		this.factor = "0.5";
		this.target_file = this.data.content.file;
		this.image = this.data.content.image;
		this.image_size = this.image.width + " X " + this.image.height;
	}

	/*
	*
	* */
	public ngAfterViewInit(): void {
		this.preview = this.preview_ref.nativeElement;
		if (this.target_file.type === "image/jpeg" || this.target_file.type === "image/png") {
			this.showPreview(this.preview);
		}
	}

	/*
	*
	* */
	public onCancel(): void {
		this.matDialogRef.close(null);
	}

	/*
	*
	* */
	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

	/*
	*
	* */
	public onResize(): void {
		if (this.target_file.type === "image/jpeg" || this.target_file.type === "image/png") {
			const factor = parseFloat(this.factor);
			if (factor !== 0) {
				this.data.content.file = this.resizeCanvasToFile(this.canvas, factor);
				this.matDialogRef.close(this.data);
			}
		} else {
			this.matDialogRef.close(this.data);
		}
	}

	/*
	*
	* */
	public showPreview(canvas: any): void {
		const ctx: any = canvas.getContext("2d");
		ctx.clearRect(0, 0, 360, 240);
		ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, 360, 240);
	}

	/*
	*
	* */
	public resizeCanvasToFile(canvas: any, factor: number): File {
		const result_width: number = this.image.width * factor;
		const result_height: number = this.image.height * factor;

		const ctx: any = canvas.getContext("2d");

		canvas.width = result_width;
		canvas.height = result_height;

		ctx.clearRect(0, 0, result_width, result_height);
		ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, result_width, result_height);

		const base64: any = canvas.toDataURL(this.target_file);
		const bin: any = atob(base64.split("base64,")[1]);
		const length: number = bin.length;
		const binary_array: Uint8Array = new Uint8Array(length);
		let index: number = 0;
		while (index < length) {
			binary_array[index] = bin.charCodeAt(index);
			index++;
		}
		return new File([binary_array], this.target_file.name, {type: this.target_file.type});
	}

}
