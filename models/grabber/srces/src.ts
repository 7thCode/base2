/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {IAccountModel} from "../../../types/server";
import {Callback, IQueryOption, IRights} from "../../../types/universe";

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

	const Src = new Schema({
		user_id: {type: String, default: ""},
		content: {
			src: {type: String, required: true, index: {unique: true}},
			alt: {type: String, default: ""},
			url: [String],
			description: {type: String, default: ""},
		},
	});

	const setId = (id: string): string => {
		const idString = id.toString();
		const shasum = crypto.createHash("sha1");
		shasum.update(idString);
		return shasum.digest("hex");
	};

	const query_by_user_read: any = (user: any, query): any => {
		return {$and: [{user_id: {$eq: user.user_id}}, query]};
	};

	const query_by_user_write: any = (user: any, query): any => {
		return {$and: [{user_id: {$eq: user.user_id}}, query]};
	};


	// Public data
	Src.methods.public = function(cb: Callback<any>): any {
		return this.content;
	};

	Src.methods._create = function(user: IAccountModel, body: any, cb: Callback<any>): void {
		this.user_id = user.user_id;
		this.content = body.content;

		this.model("Src").findOne(query_by_user_write(user, {"content.src": this.content.src}), (error, instance) => {
			if (!error) {
				if (!instance) {
					this.save(cb);
				} else {
					const setter = {
						$push: {"content.url": this.content.url},
					};
					this.model("Src").findOneAndUpdate(query_by_user_write(user, {"content.src":  this.content.src}), setter, {upsert: false}, cb);
				}
			} else {
				cb(error, null);
			}
		});
	};

	Src.methods._save = function(cb: Callback<any>): void {
		this.save(cb);
	};

	Src.statics.set_rights = function(user: IAccountModel, id: string, rights: IRights, cb: Callback<any>): void {
		const setter = {$set: {rights}};
		this.model("Src").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}, cb);
	};

	Src.statics.update_by_id = function(user: IAccountModel, src: string, content: any, cb: Callback<any>): void {
		const setter = {
			$set: {
				"user_id": user.user_id,
				"content.src": content.src,
				"content.alt": content.alt,
				"content.url": content.url,
				"content.description": content.description,
			},
		};
		this.model("Src").findOneAndUpdate(query_by_user_write(user, {"content.src": src}), setter, {upsert: true}, cb);
	};

	Src.statics.remove_by_id = function(user: IAccountModel, id: string, cb: Callback<any>): void {
		this.model("Src").findOneAndRemove(query_by_user_write(user, {"content.id": id}), cb);
	};

	Src.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Src").find(query_by_user_read(user, query), {}, option, cb);
	};

	Src.statics.default_count = function(user: IAccountModel, query: object, cb: Callback<any>): void {
		this.model("Src").countDocuments(query_by_user_read(user, query), cb);
	};

	module.exports = mongoose.model("Src", Src);
}
