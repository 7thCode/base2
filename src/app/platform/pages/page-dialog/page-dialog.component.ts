/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IEmit} from "../../../../../types/platform/universe";

import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {AngularEditorConfig} from "@kolkov/angular-editor";


@Component({
	selector: "page-dialog",
	styleUrls: ["./page-dialog.component.css"],
	templateUrl: "./page-dialog.component.html",
})

/**
 *
 *
 * @since 0.01
 */
export class PageDialogComponent implements OnInit {

	@ViewChild("editor", {static: true}) public editor;
	public text: string = "";
	public description: any;

	// angular-html-editor

	public pageContent = new FormControl("");

	// angular-html-editor
	public editorConfig: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: "25rem",
		minHeight: "5rem",
		placeholder: "Enter text here...",
		translate: "no",
		uploadUrl: "v1/images", // if needed
		customClasses: [ // optional
			{
				name: "quote",
				class: "quote",
			},
			{
				name: "redText",
				class: "redText",
			},
			{
				name: "titleText",
				class: "titleText",
				tag: "h1",
			},
		],
	};

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
		public matDialogRef: MatDialogRef<PageDialogComponent>) {
	}


	// color
	// date
	// datetime-local
	// email
	// month
	// number
	// password
	// search
	// tel
	// text
	// time
	// url
	// week
	//
	public ngOnInit() {
		this.description = [];
		this.text = this.data.content.value;
	}

	public ngAfterViewInit() {
		// this.editor.setTheme("Chrome");
		// this.editor.getEditor().setOptions({
		// 	enableBasicAutocompletion: true,
		// });

		// 	this.editor.setMode("JavaScript");

		// : todo
		// this.editor.getEditor().setOptions({
		// 	enableBasicAutocompletion: true,
		// });
	}

	public test() {

		// page-edit
		this.description = {
			type: "element", layout: "column", elements: [
				{
					type: "element", layout: "row", name: "z", class: [], style: {}, elements: [
						{
							type: "element", layout: "column", name: "z11", class: [], style: {margin: "1rem"}, elements: [
								{
									type: "input",
									name: "password",
									hint: "password",
									value: "",
									class: [],
									style: {},
									subtype: {type: "password"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "search",
									hint: "search",
									value: "",
									class: [],
									style: {},
									subtype: {type: "search"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "tel",
									hint: "tel",
									value: "",
									class: [],
									style: {},
									subtype: {type: "tel"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "text",
									hint: "text",
									value: "",
									class: [],
									style: {},
									subtype: {type: "text"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "time",
									hint: "time",
									value: "",
									class: [],
									style: {},
									subtype: {type: "time"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "url",
									hint: "url",
									value: "",
									class: [],
									style: {},
									subtype: {type: "url"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "week",
									hint: "week",
									value: "",
									class: [],
									style: {},
									subtype: {type: "week"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
							],
						},
						{
							type: "element", layout: "column", name: "z21", class: [], style: {margin: "1rem"}, elements: [
								{
									type: "input",
									name: "email",
									hint: "email",
									value: "",
									class: [],
									style: {},
									subtype: {type: "email"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "month",
									hint: "month",
									value: "",
									class: [],
									style: {},
									subtype: {type: "month"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "number",
									hint: "number",
									value: "",
									class: [],
									style: {},
									subtype: {type: "number"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "color",
									hint: "color",
									value: "",
									class: [],
									style: {},
									subtype: {type: "color"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "date",
									hint: "date",
									value: "",
									class: [],
									style: {},
									subtype: {type: "date"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
								{
									type: "input",
									name: "datetime-local",
									hint: "datetime-local",
									value: "",
									class: [],
									style: {},
									subtype: {type: "datetime-local"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}],
								},
							],
						},
						{
							type: "element", layout: "column", name: "z22", class: [], style: {margin: "1rem"}, elements: [
								{
									type: "textarea",
									name: "a",
									hint: "hint",
									value: "Sushi",
									class: [],
									style: {},
									subtype: {type: "text"},
									placeholder: "hoge",
									validators: [{name: "min", value: 4, message: "min"}, {name: "max", value: 8, message: "max"}],
								},
								{
									type: "input",
									name: "b",
									hint: "hint",
									value: "Sushi",
									class: [],
									style: {},
									subtype: {type: "text"},
									placeholder: "food",
									validators: [{name: "required", message: "required"}, {name: "email", message: "email"}],
								},
								{
									type: "select",
									name: "c",
									hint: "hint",
									value: "saab",
									class: [],
									style: {},
									label: "Cars",
									validators: [{name: "required", message: "required"}],
									options: [{value: "volvo", name: "Volvo"}, {value: "saab", name: "Saab"}, {
										value: "mercedes",
										name: "Mercedes",
									}, {value: "audi", name: "Audi"}],
								},
								{
									type: "radio",
									name: "d",
									hint: "hint",
									value: "Summer",
									class: [],
									style: {},
									label: "Seasons...",
									validators: [{name: "required", message: "required"}],
									options: ["Winter", "Spring", "Summer", "Autumn"],
								},
								{
									type: "check",
									name: "e",
									hint: "hint",
									value: true,
									class: [],
									style: {},
									label: "Check...",
									validators: [{name: "required", message: "required"}],
								},
								{type: "button", name: "f", class: [], style: {}, label: "OK", color: "primary", disabled: false},
								{type: "div", name: "g", class: [], style: {}, content: "HOGE"},
								{type: "img", name: "h", class: [], style: {}, content: "https://kakuseida.com/img/common/logo.svg"},
							],
						},
					],
				},
			],
		};
	}

	public change(event: IEmit): void {
		// 	console.log(event.value);
	}

	public click(event: IEmit): void {
		// 	console.log(event.changed);
	}

	public valid(event: IEmit): void {
	// 	const errors: any = JSON.stringify(event.value.errors);
	// 	console.error(event.source.name + " errors :" + errors);
	}

	get content(): any {
		return this.data.content;
	}

	public cancel(): void {
		this.matDialogRef.close(null);
	}

	public onAccept(): void {
		if (this.data.content.category === "HTML") { // :todo categoryの切り替えがいい感じにならない。。。どうしようか。。。
			this.data.content.value = this.pageContent.value;
		}
		this.matDialogRef.close(this.data);
	}

}
