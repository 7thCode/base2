/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../../types/platform/universe";

import {HttpClient} from "@angular/common/http";
import {Directive, OnInit} from "@angular/core";

import {SessionableComponent} from "./sessionable.component";

import {FilesService} from "../../files/files.service";
import {SessionService} from "../services/session.service";

/**
 * アップローダブルクラス
 *
 * データアップロード
 *
 * @since 0.01
 */

@Directive()

export abstract class UploadableComponent extends SessionableComponent implements OnInit {

	public endPoint: string;

	protected filesService: FilesService;
	protected bodysize: number;

	protected constructor(
		protected session: SessionService,
		protected http: HttpClient,
	) {
		super(session);
		this.filesService = new FilesService(http);
		this.endPoint = this.filesService.endPoint;
		this.bodysize = 200 * 1000 * 1000;  // default.
	}

	protected static defaultValue(change, defaultValue): any {
		let result: any = defaultValue;
		if (change) {
			result = change.currentValue;
		}
		return result;
	}

	/**
	 * ファイル削除
	 * @returns none
	 */
	protected delete(name: string, callback: Callback<any>): void {
		this.filesService.delete(name, callback);
	}

	/**
	 * ファイルアップロード
	 * @returns none
	 */
	protected upload(name: string, url: string, callback: Callback<any>): void {
		this.filesService.upload(name, this.getCategory(name, ""), url, callback);
	}

	/**
	 * @returns none
	 */
	protected getCategory(name: string, category: string): string {
		return category;
	}

	/**
	 * 単一ファイルアップロード
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
			callback({code: -1, message: "upload file too large. (limit to " + this.bodysize + "byte)" + " 8427"}, null);
		}
	}

	/**
	 * 複数ファイルアップロード
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
	 * ビューデコレータ
	 *
	 * @returns none
	 */
	protected toView(data: any): any {
		return data;
	}

	/**
	 * トランスフォーマー
	 *
	 * @returns none
	 */
	protected confirmToModel(data: any): any {
		return data;
	}

	/**
	 * マーシャリング
	 *
	 * Files配列？からFiles配列へ。
	 *
	 * @returns none
	 */
	protected marshallingFiles(files: File[]): File[] { // fileset? to array.
		const result: File[] = [];
		for (let index: number = 0; index < files.length; index++) {
			result.push(files[index]);
		}
		return result;
	}

	/**
	 *
	 * @returns none
	 */
	protected parseExtensions(extensions: string): string[] {
		return extensions.split(",");
	}

	/**
	 * ファイルエクステンションチエック
	 *
	 * @returns エクステンション
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
	 * ファイルの拡張子
	 *
	 * @returns 拡張子
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
	 * 拡張子集合に含まれる拡張子を持つファイルだけをフィルタ
	 *
	 * @param files ブラウザから渡されるファイル集合
	 * @param extensions 拡張子集合
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

	/**
	 * @returns none
	 */
	public ngOnInit(): void {
		this.getSession((error: IErrorObject, session: object): void => {
			this.bodysize = 200 * 1000 * 1000;
		});
	}

}
