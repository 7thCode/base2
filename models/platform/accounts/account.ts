/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/server";
import {AuthLevel, Callback, IAccountPublic, IRole, IQueryOption} from "../../../types/universe";

namespace AccountModel {

	const mongoose: any = require("mongoose");
	const passport: any = require("passport-local-mongoose");

	const path: any = require("path");

	const models: string = global._models;
	const controllers: string = global._controllers;
	const library: string = global._library;
	const _config: string = global.__config;

	const timestamp: any = require(path.join(models, "platform/plugins/timestamp/timestamp"));
	const grouped: any = require(path.join(models, "platform/plugins/grouped/grouped"));

	const Schema: any = mongoose.Schema;

	const Account = new Schema({
		provider: {type: String, default: "local"},
		auth: {type: Number, default: 200},
		user_id: {type: String, required: true, index: {unique: true}},
		username: {type: String, required: true, index: {unique: true}},
		password: {type: String},
		privatekey: {type: String, default: ""},
		publickey: {type: String, default: ""},
		enabled: {type: Boolean, default: true},
		category: {type: String, default: ""},
		status: {type: Number, default: 0},
		type: {type: String, default: ""},
		secret: {type: String, default: ""},
		content: {type: Schema.Types.Mixed},
	});

	Account.plugin(passport);
	Account.plugin(timestamp);
	Account.plugin(grouped);

	// プロバイダー種別とユーザレベル
	const role = (user: { auth: number, provider: string }): IRole => {
		let result: IRole = {
			login: false,
			system: false,
			manager: false,
			user: false,
			public: true,
			categoly: 0,
			raw: AuthLevel.public,
		};

		if (user) {
			let auth: number;
			let categoly: number = 0;
			switch (user.provider) {
				case "local":
					auth = user.auth;
					categoly = 0;
					break;
				case "facebook":
				case "apple":
					auth = 200;
					categoly = 1;
					break;
				default:
					auth = 200;
					categoly = 1;
			}

			result = {
				system: (auth < AuthLevel.manager),
				manager: (auth < AuthLevel.user),
				user: (auth < AuthLevel.public),
				public: true,
				categoly,
				raw: auth,
				login: true,
			};
		}
		return result;
	};

	const usernameToMail = (username: string): string => {
		return username;
	};

	Account.statics.Role = function(user: IAccountModel): IRole {
		return role(user);
	};

	// Public data
	Account.methods.public = function(cb: Callback<any>): IAccountPublic {
		const content: IAccountPublic = this.content;
		content.username = this.username;
		content.user_id = this.user_id;
		content.auth = this.auth;
		content.enabled = this.enabled;
		return content;
	};

	Account.methods._save = function(cb: Callback<any>): void {
		this.save(cb);
	};

	Account.methods.mail = function(cb: Callback<any>): string {
		let result: string = usernameToMail(this.username);
		if (this.content.mails) {
			if (this.content.mails.length > 0) { // メールアドレスが設定されていれば
				result = this.content.mails[0];
			}
		}
		return result;
	};

	Account.methods.get_status = function(cb: Callback<any>): number {
		return this.status;
	};

	Account.methods.set_status = function(status, cb: Callback<any>): void {
		this.status = status;
	};

	Account.statics.default_find_by_id = function(user: IAccountModel, id: string, cb: Callback<any>): void {
		this.model("Account").findOne({user_id: id}, cb);
	};

	Account.statics.default_find_by_name = function(user: IAccountModel, name: string, cb: Callback<any>): void {
		this.model("Account").findOne({username: name}, cb);
	};

	Account.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Account").find(query, {}, option, cb);
	};

	Account.statics.update_by_name = function(user: IAccountModel, name: string, setter: any, cb: Callback<any>): void {
		this.model("Account").findOneAndUpdate({username: name}, setter, {upsert: false}, cb);
	};

	Account.statics.set_by_name = function(user: IAccountModel, name: string, setter: any, cb: Callback<any>): void {
		this.model("Account").findOneAndUpdate({username: name}, {$set: setter}, {upsert: false}, cb);
	};

	Account.statics.remove_by_name = function(user: IAccountModel, name: string, cb: Callback<any>): void {
		this.model("Account").findOneAndRemove({$and: [{auth: {$gt: 1}}, {username: name}]}, cb);
	};

	Account.statics.publish_find = function(query: object, option: IQueryOption, cb: Callback<any>): void {
		cb(null, []);
	};

	Account.statics.publish_count = function(query: object, cb: Callback<any>): void {
		cb(null, 0);
	};

	Account.statics.publish_find_by_id = function(id: any, cb: Callback<any>): void {
		cb(null, {});
	};

	module.exports = mongoose.model("Account", Account);
}
