/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IArticleModelContent, IQueryOption, IRights} from "../../../types/platform/universe";

namespace SitesModel {

	const mongoose: any = require("mongoose");

	const path: any = require("path");

	const models: string = global._models;

	const timestamp: any = require(path.join(models, "platform/plugins/timestamp/timestamp"));

	const Schema: any = mongoose.Schema;

	const Site = new Schema({
		user_id: {type: String, default: ""},
		content: {
			url: {type: String, required: true, index: {unique: true}},
			status: {type: Number, default: 0},
			name: {type: String, default: ""},
		},
	});

	Site.plugin(timestamp, { offset: 9 });

	const query_by_user_read: any = (user: any, query): any => {
		return {$and: [{user_id: {$eq: user.user_id}}, query]};
	};

	const query_by_user_write: any = (user: any, query): any => {
		return {$and: [{user_id: {$eq: user.user_id}}, query]};
	};

	// Public data
	Site.methods.public = function(cb: Callback<any>): any {
		return this.content;
	};

	Site.methods._create = function(user: IAccountModel, body: any, cb: Callback<any>): void {
		this.user_id = user.user_id;
		this.content = body.content;
		this.save(cb);
	};

	Site.statics.set_by_id = function(user: IAccountModel, url: string, setter: object, cb: Callback<any>): void {
		this.model("Site").findOneAndUpdate(query_by_user_write(user, {"content.url": url}), setter, {upsert: false}, cb);
	};

	Site.statics.remove_by_id = function(user: IAccountModel, url: string, cb: Callback<any>): void {
		this.model("Site").findOneAndRemove(query_by_user_write(user, {"content.url": url}), cb);
	};

	Site.statics.default_find_by_id = function(user: IAccountModel, url: string, cb: Callback<any>): void {
		this.model("Site").findOne(query_by_user_read(user, {"content.url": url}), cb);
	};

	Site.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Site").find(query_by_user_read(user, query), {}, option, cb);
	};

	Site.statics.default_count = function(user: IAccountModel, query: object, cb: Callback<any>): void {
		this.model("Site").countDocuments(query_by_user_read(user, query), cb);
	};

	module.exports = mongoose.model("Site", Site);
}
