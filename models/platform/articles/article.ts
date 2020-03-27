/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IArticleModelContent, IQueryOption, IRights} from "../../../types/platform/universe";

namespace ArticleModel {

	const mongoose: any = require("mongoose");

	const crypto: any = require("crypto");

	const path: any = require("path");

	const models: string = global._models;
	const controllers: string = global._controllers;
	const library: string = global._library;
	const _config: string = global.__config;

	const timestamp: any = require(path.join(models, "platform/plugins/timestamp/timestamp"));
	const grouped: any = require(path.join(models, "platform/plugins/grouped/grouped"));
	const rights: any = require(path.join(models, "platform/plugins/rights/rights"));

	const Schema: any = mongoose.Schema;

	const Article = new Schema({
		user_id: {type: String, default: ""},
		content: {
			id: {type: String, required: true, index: {unique: true}},
			parent_id: {type: String, default: ""},
			enabled: {type: Boolean, default: true},
			category: {type: String, default: ""},
			status: {type: Number, default: 0},
			type: {type: String, default: ""},
			name: {type: String, default: ""},
			value: {type: Schema.Types.Mixed},
			accessory: {type: Schema.Types.Mixed},
		},
	});

	Article.plugin(rights);
	Article.plugin(timestamp, { offset: 9 });
	Article.plugin(grouped);

	Article.index({"user_id": 1, "content.id": 1}, {unique: true});

	const setId = (id: string): string => {
		const idString = id.toString();
		const shasum = crypto.createHash("sha1");
		shasum.update(idString);
		return shasum.digest("hex");
	};

	const query_by_user_read: any = (user: any, query): any => {
		// return {$and: [{$or: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}]}, query]};
		return {$and: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}, query]};
	};

	const query_by_user_write: any = (user: any, query: object): any => {
		// return {$and: [{$or: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}]}, query]};
		return {$and: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}, query]};
	};

	const init: any = (_id: any, body: any): IArticleModelContent => {
		const content: IArticleModelContent = {
			id: setId(_id),
			parent_id: body.parent_id,
			enabled: body.enabled,
			category: body.category,
			status: body.status,
			type: body.type,
			name: body.name,
			value: body.value,
			accessory: body.accessory,
		};

		if (body.id) {
			content.id = body.id;
		}

		return content;
	};

	// Public data
	Article.methods.public = function(cb: Callback<any>): any {
		return this.content;
	};

	Article.methods._create = function(user: IAccountModel, body: any, cb: Callback<any>): void {
		this.user_id = user.user_id;
		this.content = init(this._id, body.content);

		this.model("Article").findOne(query_by_user_write(user, {"content.id": this.content.id}), (error, instance) => {
			if (!error) {
				if (!instance) {
					this.save(cb);
				} else {
					cb({code: -1, message: "already."}, null);
				}
			} else {
				cb(error, null);
			}
		});
	};

	Article.methods._save = function(cb: Callback<any>): void {
		this.save(cb);
	};

	Article.statics.set_rights = function(user: IAccountModel, id: string, rights: IRights, cb: Callback<any>): void {
		const setter = {$set: {rights}};
		this.model("Article").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}, cb);
	};

	Article.statics.update_by_id = function(user: IAccountModel, id: string, content: any, cb: Callback<any>): void {
		const setter = {
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
		this.model("Article").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}, cb);
	};

	Article.statics.set_by_id = function(user: IAccountModel, id: string, setter: object, cb: Callback<any>): void {
		this.model("Article").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}, cb);
	};

	Article.statics.remove_by_id = function(user: IAccountModel, id: string, cb: Callback<any>): void {
		this.model("Article").findOneAndRemove(query_by_user_write(user, {"content.id": id}), cb);
	};

	Article.statics.default_find_by_id = function(user: IAccountModel, id: string, cb: Callback<any>): void {
		this.model("Article").findOne(query_by_user_read(user, {"content.id": id}), cb);
	};

	Article.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Article").find(query_by_user_read(user, query), {}, option, cb);
	};

	Article.statics.default_count = function(user: IAccountModel, query: object, cb: Callback<any>): void {
		this.model("Article").countDocuments(query_by_user_read(user, query), cb);
	};

	Article.statics.publish_find = function(query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Article").find(query, {}, option, cb);
	};

	Article.statics.publish_count = function(query: object, cb: Callback<any>): void {
		this.model("Article").countDocuments(query, cb);
	};

	Article.statics.publish_find_by_id = function(id: string, cb: Callback<any>): void {
		this.model("Article").findOne({"content.id": id}, cb);
	};

	module.exports = mongoose.model("Article", Article);
}
