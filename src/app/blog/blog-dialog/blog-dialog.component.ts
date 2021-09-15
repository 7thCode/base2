/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Component, Inject, NgZone} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {BaseDialogComponent} from "../../platform/base/components/base-dialog.component";

/**
 *
 *
 * @since 0.01
 */
@Component({
	selector: "blog-dialog",
	styleUrls: ["./blog-dialog.component.css"],
	templateUrl: "./blog-dialog.component.html",
})

export class BlogDialogComponent extends BaseDialogComponent {

	public config: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		enableToolbar: true,
		showToolbar: true,
		height: '200px',
		minHeight: '50px',
		placeholder: 'Enter description...',
		translate: 'no',
		defaultParagraphSeparator: 'p',
		uploadWithCredentials: false,
		sanitize: false,
		defaultFontName: 'Arial',
		fonts: [
			{class: 'arial', name: 'Arial'},
			{class: 'times-new-roman', name: 'Times New Roman'},
			{class: 'calibri', name: 'Calibri'}
		],
		customClasses: [
			{
				name: 'container',
				class: 'flex-container',
			},
			{
				name: 'row',
				class: 'flex-row',
			},
			{
				name: 'column',
				class: 'flex-column',
			}
		],
		toolbarPosition: 'top',
		toolbarHiddenButtons: [
			[
				"subscript",
				"superscript",
				"insertUnorderedList",
				"insertOrderedList",
				"heading",
				"fontName"
			],
			[
				"backgroundColor",
				"insertVideo",
				"insertHorizontalRule",
				"removeFormat",
			]
		]
	};

	public images: any[];

	/**
	 * @constructor
	 * @param data
	 * @param matDialogRef
	 * @param zone
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<BlogDialogComponent>,
		private zone: NgZone) {
		super();
	}

	/**
	 *
	 */
	get content(): any {
		return this.data.content;
	}

	/*
*
*/
	public ngOnInit(): void {
		this.images = this.content.accessory.images;
	}

	/**
	 *
	 */
	public cancel(): void {
		this.matDialogRef.close(null);
	}

	/**
	 *
	 */
	public onAccept(): void {
		this.matDialogRef.close(this.data);
	}

	/**
	 * @param index
	 * @param event ウィンドウイベント
	 */
	// @HostListener("drop", ["$event"])
	public onDrop(index: number, event: any): void {
		if (this.images.length > index) {
			if (event.type === "create") {
				this.images[index].name = event.value.name;
			}
		}
	}
}
