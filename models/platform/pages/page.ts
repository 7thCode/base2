/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IErrorObject, IPageModelContent, IQueryOption, IRights} from "../../../types/platform/universe";

/*
*
* */
namespace PageModel {

	const mongoose: any = require("mongoose");

	const pug: any = require("pug");
	const ejs: any = require("ejs");
	const marked: any = require("marked");

	const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");
	const grouped: any = require("../../../models/platform/plugins/grouped/grouped");
	const rights: any = require("../../../models/platform/plugins/rights/rights");

	const Schema = mongoose.Schema;

	const Page = new Schema({
		user_id: {type: Schema.Types.ObjectId},	// owner
		username: {type: String, default: ""},
		content: {
			id: {type: Schema.Types.ObjectId, required: true, index: {unique: true}},	// main key
			relations: {type: mongoose.Schema.Types.Mixed},
			enabled: {type: Boolean, default: true},
			category: {type: String, default: ""},
			status: {type: Number, default: 0},
			type: {type: String, default: ""},
			path: {type: String, required: true},
			value: {type: String, default: ""},
			accessory: {type: Schema.Types.Mixed},
		},
	});

	Page.plugin(rights);		// 権限
	Page.plugin(timestamp, {offset: 9});
	Page.plugin(grouped);

	Page.index({user_id: 1});
	Page.index({username: 1});
	Page.index({"user_id": 1, "content.path": 1}, {unique: true});

	/*
		ユーザが一致するか、読み込み権限があるものを検索するクエリーを返す。
	*/
	const query_by_user_read: any = (user: any, query: any): any => {
		let result: any = {user_id: null};
		if (user) {
			result = {$and: [{$or: [{username: user.username}, {user_id: user.user_id}]}, {"rights.read": {$gte: user.auth}}, query]};
		}
		return result;
	};

	/*
		ユーザが一致するか、書き込み権限があるものを検索するクエリーを返す
	*/
	const query_by_user_write: any = (user: any, query: object): any => {
		let result: any = {user_id: null};
		if (user) {
			result = {$and: [{$or: [{username: user.username}, {user_id: user.user_id}]}, {"rights.write": {$gte: user.auth}}, query]};
		}
		return result;
	};

	/*
	* 初期値
	* */
	const init: any = (body: any): IPageModelContent => {
		const id = new mongoose.Types.ObjectId();
		const content: IPageModelContent = {
			id: id,
			parent_id: body.parent_id,
			enabled: body.enabled,
			category: body.category,
			status: body.status,
			type: body.type,
			path: body.path,
			value: body.value,
			accessory: body.accessory,
		};

		if (body.id) {
			content.id = body.id;
		}

		return content;
	};

	// Public data
	Page.methods.public = function (callback: Callback<any>): any {
		return this.content;
	};

	/*
	*
	*  */
	Page.methods._create = function (user: IAccountModel, body: any, callback: Callback<any>): void {
		this.user_id = user.user_id;
		this.username = user.username;
		this.content = init(body.content);

		this.model("Page").findOne(query_by_user_write(user, {"content.path": this.content.path})).then((instance: any) => {
			if (!instance) {　// 既にないなら
				this.save(callback);
			} else {
				callback(null, null); // already.
			}
		}).catch((error: IErrorObject) => {
			callback(error, null)
		})
	};

	// Page.methods._save = function (callback: Callback<any>): void {
	// 	this.save(callback);
	// };

	Page.statics.get_page = function (username: string, path: string, object: any, callback: (error: IErrorObject, doc: any, mimetype: string) => void): void {
		this.model("Page").findOne({$and: [{username}, {"content.path": path}]}).then((instance: any): void => {
			if (instance) {
				const content: any = instance.content;
				const type: string = content.type;
				const category: string = content.category;
				let doc: any = content.value;
				if (category) {
					switch (category.toLowerCase()) {
						case "pug":
						case "jade":
							doc = pug.render(content.value, object);
							break;
						case "ejs":
							doc = ejs.render(content.value, object);
							break;
						case "markdown":
							doc = marked(content.value);
							break;
						default:
					}
				}
				callback(null, doc, type);
			} else {
				callback({code: -1, message: "not found. 633"}, null, "");
			}
		}).catch((error: IErrorObject) => {
			callback(error, null, "");
		})
	};

	Page.statics.set_rights = function (user: IAccountModel, id: string, rights: IRights): Promise<any> {
		const setter = {$set: {rights}};
		return this.model("Page").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false});
	};

	Page.statics.update_by_id = function (user: IAccountModel, id: string, content: any): Promise<any> {
		const setter = {
			$set: {
				"content.enabled": content.enabled,
				"content.category": content.category,
				"content.status": content.status,
				"content.type": content.type,
				"content.path": content.path,
				"content.value": content.value,
				"content.accessory": content.accessory,
			},
		};
		return this.model("Page").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false});
	};

	Page.statics.set_by_id = function (user: IAccountModel, id: string, setter: any): Promise<any> {
		return this.model("Page").findOneAndUpdate(query_by_user_read(user, {"content.id": id}), setter, {upsert: false});
	};

	Page.statics.remove_by_id = function (user: IAccountModel, id: string): Promise<any> {
		return this.model("Page").findOneAndRemove(query_by_user_read(user, {"content.id": id}));
	};

	Page.statics.default_find_by_id = function (user: IAccountModel, id: string): Promise<any> {
		return this.model("Page").findOne(query_by_user_read(user, {"content.id": id}));
	};

	Page.statics.default_find = function (user: IAccountModel, query: object, option: IQueryOption): Promise<any> {
		return this.model("Page").find(query_by_user_read(user, query), {}, option);
	};

	Page.statics.default_count = function (user: IAccountModel, query: object): Promise<any> {
		return this.model("Page").countDocuments(query_by_user_read(user, query));
	};

	Page.statics.publish_find = function (query: object, option: IQueryOption): Promise<any> {
		return this.model("Page").find(query, {}, option);
	};

	Page.statics.publish_count = function (query: object): Promise<any> {
		return this.model("Page").countDocuments(query);
	};

	Page.statics.publish_find_by_id = function (id: any): Promise<any> {
		return this.model("Page").findOne({"content.id": id});
	};

	module.exports = mongoose.model("Page", Page);
}
