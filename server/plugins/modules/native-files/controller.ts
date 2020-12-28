/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, IErrorObject} from "../../../../types/platform/universe";

import {INativeFileModel} from "../../../../types/plugins/server";
import {IAccountModel, IDeleteFile, IDeleteRequest, IDParam, IJSONResponse, IPostFile, IPostRequest, IUpdatableModel} from "../../../../types/platform/server";

const Updatable: any = require("../../../platform/base/controllers/updatable_controller");

const NativeFile: any = require("../../../../models/plugins/native-files/native-file");

const sharp: any = require("sharp");

export class NativeFiles extends Updatable {

	protected Model: any;

	/**
	 *
	 * @param event
	 * @param config
	 * @param logger
	 */
	constructor(event: object, config: any, logger: object) {
		super(event, config, logger);
		this.Model = NativeFile as INativeFileModel;
	}

	/*
	*
	*
	*
	*/
	private static mailAddressToFileName(s: string): string {
		let result: string = "";
		const table: any = {
			"#":"!00", "%":"!01", "&":"!02", "'":"!03",
			"*":"!04", "/":"!05", "?":"!06", "^":"!07",
			"_":"!08", "`":"!09", "{":"!0A", "|":"!0B",
			"}":"!0C", "~":"!0D"
		}
		for (const t of s) {
			const c = table[t];
			if (c) {
				result += c;
			} else {
				result += t;
			}
		}
		return result;
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	public post(request: IPostFile, response: IJSONResponse): void {
		try {
			const path: string = request.params[0];
			const body: any = request.body;
			const operator: IAccountModel = this.Transform(request.user);
			body.filepath = "image/" + NativeFiles.mailAddressToFileName(operator.username) + "/" + path;
			const object: IUpdatableModel = new this.Model();
			object._create(operator, body, (error: IErrorObject, object: IUpdatableModel): void => {
				this.ifSuccess(response, error, (): void => {
					this.ifExist(response, {code: -1, message: "not found."}, object, () => {
						this.SendSuccess(response, object.public());
					});
				});
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	/**
	 *
	 * @param request
	 * @param response
	 */
	public delete(request: IDeleteFile, response: IJSONResponse): void {
		try {
			const path: string = request.params[0];
			const operator: IAccountModel = this.Transform(request.user);
			const target_path = "image/" + this.mailAddressToFileName(operator.username) + "/" + path;
			this.Model.remove_by_name_promise(operator, target_path).then((object: IUpdatableModel): void => {
				this.SendSuccess(response, {});
			}).catch((error: IErrorObject) => {
				this.SendError(response, error);
			});
		} catch (error) {
			this.SendError(response, error);
		}
	}

	public renderFile(request: any, response: any, next: any): void {

	}

	public renderId(request: any, response: any, next: any): void {

	}

	/**
	 *
	 * @param mimetype ex. "image/jpeg"...
	 * @param query
	 * @param command  ex. [{"c":"resize","p":{"width":300,"height":100}}]
	 * @param stream
	 * @param callback
	 * @returns none
	 */
	public effect(mimetype: string, query: { w: string, h: string }, command: string, stream: any, callback: Callback<any>): void {
		switch (mimetype) {
			case "image/jpeg":
			case "image/jpg":
			case "image/png":
			case "image/webp":
				if (command) { // image effect
					try {
						const commands: any[] = JSON.parse(command);
						if (Array.isArray(commands)) {
							commands.forEach((command) => {
								const parameter = command.p;
								switch (command.c) {
									case "resize": {
										stream = this.resize(parameter, stream);
										break;
									}
									case "extend": {
										stream = this.extend(parameter, stream);
										break;
									}
									case "extract": {
										stream = this.extract(parameter, stream);
										break;
									}
									case "trim": {
										break;
									}
									case "rotate": {
										stream = this.rotate(parameter, stream);
										break;
									}
									case "flip": {
										stream = this.flip(parameter, stream);
										break;
									}
									case "flop": {
										stream = this.flop(parameter, stream);
										break;
									}
									case "sharpen": {
										stream = this.sharpen(parameter, stream);
										break;
									}
									case "median": {
										stream = this.median(parameter, stream);
										break;
									}
									case "blur": {
										stream = this.blur(parameter, stream);
										break;
									}
									case "flatten": {
										stream = this.flatten(parameter, stream);
										break;
									}
									case "gamma": {
										stream = this.gamma(parameter, stream);
										break;
									}
									case "negate": {
										stream = this.negate(parameter, stream);
										break;
									}
									case "normalise": {
										stream = this.normalise(parameter, stream);
										break;
									}
									case "threshold": {
										stream = this.threshold(parameter, stream);
										break;
									}
									case "boolean": {
										stream = this.boolean(parameter, stream);
										break;
									}
									case "linear": {
										stream = this.linear(parameter, stream);
										break;
									}
									case "recomb": {
										stream = this.recomb(parameter, stream);
										break;
									}
									case "tint": {
										stream = this.tint(parameter, stream);
										break;
									}
									case "greyscale": {
										stream = this.greyscale(parameter, stream);
										break;
									}
									default:
								}
							});
						} else {
							callback({code: -1, message: "invalid command." + " 5962"}, stream);
						}
					} finally {
						callback(null, stream);
					}
				} else { // shorthand
					try {
						const width: number = parseInt(query.w, 10);
						const height: number = parseInt(query.h, 10);
						if (width || height) {
							stream = this.resize({width, height}, stream);
						}
					} finally {
						callback(null, stream);
					}
				}
				break;
			default:
				callback(null, stream);
		}
	}

	// {"c":"resize","p":{"width":100,"height":100}};
	public resize(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().resize(parameter);
		return result.pipe(resizer);
	}

	// {"c":"extend","p":{"top":100,"bottom":200,"left":100,"right":100,"background":{"r":100,"g":100,"b":0,"alpha":1}}}
	public extend(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().extend(parameter);
		return result.pipe(resizer);
	}

	//  {"c": "extract", "p":{ "left": 50, "top": 10, "width": 30, "height": 40 }}
	public extract(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().extract(parameter);
		return result.pipe(resizer);
	}

	// {"c": "rotate", "p": { "angle": 45}};
	public rotate(parameter: any, result: any): object {
		const angle: WritableStream = parameter.angle || 90;
		const resizer: object = sharp().rotate(angle);
		return result.pipe(resizer);
	}

	// {"c": "flip", "p": {}};
	public flip(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().flip();
		return result.pipe(resizer);
	}

	// {"c": "flop", "p": {}};
	public flop(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().flop();
		return result.pipe(resizer);
	}

	// {"c": "sharpen", "p": {"sigma":1.2}};
	public sharpen(parameter: any, result: any): object {
		const sigma: number = parameter.sigma || 10;
		const resizer: WritableStream = sharp().sharpen(Math.min(1000, Math.max(sigma, 0.3)));
		return result.pipe(resizer);
	}

	// {"c": "median", "p": {"size":10}};
	public median(parameter: any, result: any): object {
		const size: number = parameter.size || 3;
		const resizer: WritableStream = sharp().median(size);
		return result.pipe(resizer);
	}

	// {"c": "blur", "p": {"sigma":1.2}};
	public blur(parameter: any, result: any): object {
		const sigma: number = parameter.sigma || 10;
		const resizer: WritableStream = sharp().blur(Math.min(1000, Math.max(sigma, 0.3)));
		return result.pipe(resizer);
	}

	public flatten(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().flatten(parameter);
		return result.pipe(resizer);
	}

	public gamma(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().gamma(parameter);
		return result.pipe(resizer);
	}

	public negate(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().negate(parameter);
		return result.pipe(resizer);
	}

	public normalise(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().normalise(parameter);
		return result.pipe(resizer);
	}

	public threshold(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().threshold(parameter);
		return result.pipe(resizer);
	}

	public boolean(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().boolean(parameter);
		return result.pipe(resizer);
	}

	public linear(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().linear(parameter);
		return result.pipe(resizer);
	}

	public recomb(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().recomb(parameter);
		return result.pipe(resizer);
	}

	public tint(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().tint(parameter);
		return result.pipe(resizer);
	}

	public greyscale(parameter: any, result: any): object {
		const resizer: WritableStream = sharp().greyscale(parameter);
		return result.pipe(resizer);
	}

}

module.exports = NativeFiles;
