/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IArticleModelContent, IErrorObject, IQueryOption, IRights} from "../../../types/platform/universe";

namespace ArticleModel {

	const mongoose: any = require("mongoose");

	const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");
	const grouped: any = require("../../../models/platform/plugins/grouped/grouped");
	const rights: any = require("../../../models/platform/plugins/rights/rights");

	const Schema: any = mongoose.Schema;

	const Article = new Schema({
		user_id: {type: Schema.Types.ObjectId},	// owner
		content: {
			id: {type: Schema.Types.ObjectId, required: true, index: {unique: true}},	// main key
			relations: {type: mongoose.Schema.Types.Mixed},
			enabled: {type: Boolean, default: true},
			category: {type: String, default: ""},
			status: {type: Number, default: 0},
			type: {type: String, default: ""},
			name: {type: String, default: ""},
			value: {type: Schema.Types.Mixed},
			accessory: {type: Schema.Types.Mixed},
		},
	});

	Article.plugin(rights);		// 権限
	Article.plugin(timestamp, { offset: 9 });
	Article.plugin(grouped);

	Article.index({"user_id": 1, "content.id": 1}, {unique: true});

	/*
	ユーザが一致するか、読み込み権限があるものを検索するクエリーを返す
	*/
	const query_by_user_read: any = (user: any, query: object): any => {
		const result: any = query;
	// 	if (user) {
	// 	// 	result = {$and: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}, query]};
	// 		result = {$and: [{"rights.read": {$gte: user.auth}}, query]};
	// 	}
		return result;
	};

	/*
	ユーザが一致するか、書き込み権限があるものを検索するクエリーを返す
	*/
	const query_by_user_write: any = (user: any, query: object): any => {
		let result: any = {user_id: null};
		if (user) {
			result = {$and: [{"rights.write": {$gte: user.auth}}, query]};
		}
		return result;
	};

	const init: any = (_id: any, body: any): IArticleModelContent => {
		const id: any = new mongoose.Types.ObjectId();
		return {
			id:  id,
			parent_id: body.parent_id,
			enabled: body.enabled,
			category: body.category,
			status: body.status,
			type: body.type,
			name: body.name,
			value: body.value,
			accessory: body.accessory,
		};
	};

	// Public data
	Article.methods.public = function(callback: Callback<any>): any {
		return this.content;
	};

	Article.methods._create = function(user: IAccountModel, body: any, callback: Callback<any>): void {
		this.user_id = user.user_id;
		this.username = user.username;
		this.content = init(this._id, body.content);
		this.model("Article").findOne(query_by_user_write(user, {"content.id": this.content.id})).then((instance: any) => {
				if (!instance) {
					this.save(callback);
				} else {
					callback(null, null); // rlready
				}
		}).catch((error: IErrorObject) => {
			callback(error, null);
		});
	};

	// Article.methods._save = function(): Promise<any> {
	// 	return this.save();
	// };

	Article.statics.set_rights = function(user: IAccountModel, id: string, rights: IRights): Promise<any> {
		const setter: {$set: any} = {$set: {rights}};
		return this.model("Article").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false});
	};

	Article.statics.update_by_id = function(user: IAccountModel, id: string, content: any): Promise<any> {
		const setter: {$set: any} = {
			$set: {
				"content.parent_id": content.parent_id,
				"content.enabled": content.enabled,
				"content.category": content.category,
				"content.status": content.status,
				"content.type": content.type,
				"content.name": content.name,
				"content.value": content.value,
				"content.accessory": content.accessory,
			},
		};
		return this.model("Article").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false});
	};

	Article.statics.set_by_id = function(user: IAccountModel, id: string, setter: object): Promise<any> {
		return this.model("Article").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false});
	};

	Article.statics.remove_by_id = function(user: IAccountModel, id: string): Promise<any> {
		return this.model("Article").findOneAndRemove(query_by_user_write(user, {"content.id": id}));
	};

	Article.statics.default_find_by_id = function(user: IAccountModel, id: string): Promise<any> {
		return this.model("Article").findOne(query_by_user_read(user, {"content.id": id}));
	};

	Article.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption): Promise<any> {
		return this.model("Article").find(query_by_user_read(user, query), {}, option);
	};

	Article.statics.default_count = function(user: IAccountModel, query: object): Promise<any> {
		return this.model("Article").countDocuments(query_by_user_read(user, query));
	};

	Article.statics.publish_find = function(query: object, option: IQueryOption): Promise<any> {
		return this.model("Article").find(query, {}, option);
	};

	Article.statics.publish_count = function(query: object): Promise<any> {
		return this.model("Article").countDocuments(query);
	};

	Article.statics.publish_find_by_id = function(id: string): Promise<any> {
		return this.model("Article").findOne({"content.id": id});
	};

	module.exports = mongoose.model("Article", Article);
}
