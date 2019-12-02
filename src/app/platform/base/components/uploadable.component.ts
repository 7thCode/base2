/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HttpClient} from "@angular/common/http";

import {ChangeDetectorRef, OnInit} from "@angular/core";
import {Callback, IErrorObject} from "../../../../../types/universe";
import {ConstService} from "../services/const.service";
import {FileService} from "../services/file.service";
import {SessionService} from "../services/session.service";
import {SessionableComponent} from "./sessionable.component";

/**
 * アップローダブルクラス
 *
 * データアップロード
 *
 * @since 0.01
 */
export abstract class UploadableComponent extends SessionableComponent implements OnInit {

	protected fileService: FileService;
	protected bodysize: number;

	protected static defaultValue(change, defaultValue): any {
		let result: any = defaultValue;
		if (change) {
			result = change.currentValue;
		}
		return result;
	}

	public endPoint: string;

	protected constructor(
		protected session: SessionService,
		protected http: HttpClient,
		protected constService: ConstService,
		protected change: ChangeDetectorRef,
	) {
		super(session, change);
		this.fileService = new FileService(http, constService);
		this.endPoint = this.fileService.endPoint;
		this.bodysize = 200 * 1000 * 1000;  // default.
	}

	public ngOnInit(): void {
		this.getSession((error: IErrorObject, session: object): void => {
			this.bodysize = 200 * 1000 * 1000;
		});
	}

	/**
	 * @returns none
	 */
	protected delete(name: string, callback: Callback<any>): void {
		this.fileService.delete(name, callback);
	}

	/**
	 * @returns none
	 */
	protected upload(name: string, url: string, callback: Callback<any>): void {
		this.fileService.upload(name, this.getCategory(name, ""), url, callback);
	}

	/**
	 * @returns none
	 */
	protected getCategory(name: string, category: string): string {
		return category;
	}

	/**
	 * @returns none
	 */
	protected uploadFile(dropedFile: File, name: string, callback: Callback<any>): void {
		if (dropedFile.size < this.bodysize) {
			const fileReader: FileReader = new FileReader();
			fileReader.onload = (event: any): void => {
				this.upload(name, event.target.result, (error: IErrorObject, result: any) => {
					if (!error) {
						callback(null, result);
					} else {
						callback(error, null);
					}
				});
			};
			fileReader.readAsDataURL(dropedFile);
		} else {
			callback({code: -1, message: "upload file too large. (limit to " + this.bodysize + "byte)"}, null);
		}
	}

	/**
	 * @returns none
	 */
	protected uploadFiles(path: string, dropedFiles: File[], callback: Callback<any>): void {
		const promises: Array<Promise<any>> = [];
		const files: File[] = this.marshallingFiles(dropedFiles);
		files.forEach((file: File) => {
			const promise: Promise<any> = new Promise<any>((resolve, reject): void => {
				this.uploadFile(file, path + file.name, (error, result): void => {
					if (!error) {
						resolve(result);
					} else {
						reject(error);
					}
				});
			});
			promises.push(promise);
		});

		Promise.all(promises).then((result): void => {
			callback(null, result);
		}).catch((error): void => {
			callback(error, null);
		});
	}

	/**
	 * @returns none
	 */
	protected toView(data: any): any {
		return data;
	}

	/**
	 * @returns none
	 */
	protected confirmToModel(data: any): any {
		return data;
	}

	protected marshallingFiles(files: File[]): File[] { // fileset? to array.
		const result: File[] = [];
		for (let index: number = 0; index < files.length; index++) {
			result.push(files[index]);
		}
		return result;
	}

	/**
	 * @returns none
	 */
	protected parseExtensions(extensions: string): string[] {
		return extensions.split(",");
	}

	/**
	 * @returns none
	 */
	protected hasExtension(file: { name: string }, extensions: string): boolean {
		let result: boolean = false;
		this.parseExtensions(extensions).some((extension): any => {
			const fileExtension: string[] = file.name.split(".");
			if (fileExtension.length >= 2) {
				if (extension.toLocaleLowerCase() === fileExtension[fileExtension.length - 1].toLocaleLowerCase()) {
					result = true;
					return true;
				}
			}
		});
		return result;
	}

	/**
	 * @returns none
	 */
	protected Extension(file: { name: string }): string {
		let result: string = "";
		const fileExtension: string[] = file.name.split(".");
		if (fileExtension.length >= 2) {
			result = fileExtension[fileExtension.length - 1].toLocaleLowerCase();
		}
		return result;
	}

	/**
	 * @returns none
	 */
	protected filterExtensionFiles(files: File[], extensions: string): File[] {
		const result: File[] = [];
		files.forEach((file): any => {
			if (this.hasExtension(file, extensions)) {
				result.push(file);
			}
		});
		return result;
	}

}
