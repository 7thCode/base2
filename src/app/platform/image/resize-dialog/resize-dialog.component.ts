/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IErrorObject} from "../../../../../types/platform/universe";

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

	private reader: FileReader = null;
	private image: any = null;
	private canvas: any = null;
	private target_file: File = null;
	private type_to: string = "image/jpeg";

	get content(): any {
		return this.data.content;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<ResizeDialogComponent>) {

		this.reader = new FileReader();
		this.image = new Image();
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
	}

	/*
	*
	* */
	public ngAfterViewInit(): void {
		this.preview = this.preview_ref.nativeElement;
		if (this.target_file.type === "image/jpeg" || this.target_file.type === "image/png") {
			this.showPreview(this.preview, this.target_file, (error: IErrorObject, image: any) => {
				this.image_size = image.width + " X " + image.height;
			});
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
				this.resize(this.target_file, factor, (error, result) => {
					if (!error) {
						this.data.content.file = result;
					}
					this.matDialogRef.close(this.data);
				});
			}
		} else {
			this.matDialogRef.close(this.data);
		}
	}


	/*
	*
	* */
	public showPreview(canvas: any, target_file: any, callback: (error: IErrorObject, result: any) => void): void {
		const reader = new FileReader();
		const image = new Image();
		reader.onload = (event) => {
			image.onload = () => {
				const ctx: any = canvas.getContext("2d");
				ctx.clearRect(0, 0, 360, 240);
				ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 360, 240);
				callback(null, image);
			}
			image.src = (event.target.result as string);
		}
		reader.readAsDataURL(target_file);
	}

	/*
	*
	* */
	public resize(target_file: any, factor: number, callback: (error: IErrorObject, result: any) => void): void {

		this.reader.onload = (event) => {

			this.image.onload = () => {

				const result_width: number = this.image.width * factor;
				const result_height: number = this.image.height * factor;

				const ctx: any = this.canvas.getContext("2d");

				this.canvas.width = result_width;
				this.canvas.height = result_height;

				ctx.clearRect(0, 0, result_width, result_height);
				ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, result_width, result_height);

				const base64: any = this.canvas.toDataURL(this.type_to);
				const bin: any = atob(base64.split("base64,")[1]);
				const length: number = bin.length;
				const binary_array: Uint8Array = new Uint8Array(length);
				let index: number = 0;
				while (index < length) {
					binary_array[index] = bin.charCodeAt(index);
					index++;
				}

				const file: File = new File([binary_array], target_file.name, {type: this.type_to});
				callback(null, file);
			}

			this.image.src = (event.target.result as string);
		}

		this.reader.readAsDataURL(target_file);
	}

}
