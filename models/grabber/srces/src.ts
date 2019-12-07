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

	const path: any = require("path");

	const models: string = global._models;
	const controllers: string = global._controllers;
	const library: string = global._library;
	const _config: string = global.__config;

	const Schema: any = mongoose.Schema;

	const Src = new Schema({
		user_id: {type: String, default: ""},
		content: {
			src: {type: String, required: true, index: {unique: true}},
			alt: {type: String, default: ""},
			url: {type: String, default: ""},
			description: {type: String, default: ""},
		},
	});


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

	Src.statics.set = function(user: IAccountModel, src: string, setter: object, cb: Callback<any>): void {
		this.model("Src").findOneAndUpdate(query_by_user_write(user, {"content.src": src}), setter, {upsert: true}, cb);
	};

	Src.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Src").find(query_by_user_read(user, query), {}, option, cb);
	};

	Src.statics.default_count = function(user: IAccountModel, query: object, cb: Callback<any>): void {
		this.model("Src").countDocuments(query_by_user_read(user, query), cb);
	};

	module.exports = mongoose.model("Src", Src);
}
