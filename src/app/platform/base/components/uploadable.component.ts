/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../../types/platform/universe";
import {Directive, OnInit} from "@angular/core";

import {SessionableComponent} from "./sessionable.component";
import {SessionService} from "../services/session.service";
import {environment} from "../../../../environments/environment";
import {Errors} from "../library/errors";

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

	protected filesService: any;
	protected bodysize: number;

	protected constructor(
		protected session: SessionService,
		// 	protected http: HttpClient,
	) {
		super(session);
		// 	this.filesService = new FilesService(http);
		// 	this.endPoint = this.filesService.endPoint;
		this.endPoint = environment.endPoint;
		this.bodysize = 200 * 1000 * 1000;  // default.
	}

	protected static defaultValue(change: any, defaultValue: any): any {
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
	// protected upload(name: string, url: string, category: string, params: any, callback: Callback<any>): void {
	// 	this.filesService.upload(name, category, params, url, callback);
	// }

	/**
	 * 単一ファイルアップロード
	 * @returns none
	 */
	protected uploadFile(dropedFile: File, name: string, metadata: { category: string, description: string }, params: { upsert: boolean }, callback: Callback<any>): void {
		if (dropedFile.size < this.bodysize) {
			const fileReader: FileReader = new FileReader();
			fileReader.onload = (event: any): void => {
				this.filesService.upload(name, event.target.result, metadata, params, (error: IErrorObject, result: any) => {
					if (!error) {
						callback(null, result);
					} else {
						callback(error, null);
					}
				});
			};
			fileReader.readAsDataURL(dropedFile);
		} else {
			callback(Errors.generalError(-1, "upload file too large. (limit to " + this.bodysize + "byte).", "A00195"), null);
		}
	}

	/**
	 * 複数ファイルアップロード
	 * @returns none
	 */
	protected uploadFiles(path: string, dropedFiles: File[], metadata: { category: string, description: string }, params: { upsert: boolean }, callback: Callback<any>): void {
		// 	const promises: Array<Promise<any>> = [];
		const promises: Promise<any>[] = [];
		const files: File[] = this.marshallingFiles(dropedFiles);
		files.forEach((file: File) => {
			const promise: Promise<any> = new Promise<any>((resolve, reject): void => {
				this.uploadFile(file, path + file.name, metadata, params, (error, result): void => {
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
		}).catch((error: IErrorObject): void => {
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
		const result: File[] = Array.from(files);
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
	 *
	 * @mime
	 */
	protected mimeToMedia(mime: string): string {
		let result = "";
		if (mime) {
			const type: string[] = mime.split("/");
			if (type.length >= 2) {
				result = type[0].toLocaleLowerCase();
			}
		}
		return result;
	}

	/**
	 *
	 * @mime
	 */
	protected mimeToType(mime: string): string {
		let result = "";
		if (mime) {
			const type: string[] = mime.split("/");
			if (type.length >= 2) {
				result = type[type.length - 1].toLocaleLowerCase();
			}
		}
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
		this.bodysize = 200 * 1000 * 1000;
	}

}
