/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IAccountPublic, IQueryOption} from "../../../types/platform/universe";

namespace AccountModel {

	const mongoose: any = require("mongoose");
	const passport: any = require("passport-local-mongoose");

	const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");
	const grouped: any = require("../../../models/platform/plugins/grouped/grouped");

	const Schema: any = mongoose.Schema;

	const Account = new Schema({
		provider: {type: String, default: "local"},
		auth: {type: Number, default: 200},
	// 	user_id: {type: String, required: true, index: {unique: true}},
		user_id: {type: Schema.Types.ObjectId, required: true, index: {unique: true}},
		username: {type: String, required: true, index: {unique: true}},
		password: {type: String},
		relations: {type: mongoose.Schema.Types.Mixed},
		privatekey: {type: String, default: ""},
		publickey: {type: String, default: ""},
		enabled: {type: Boolean, default: true},
		category: {type: String, default: ""},
		status: {type: Number, default: 0},
		type: {type: String, default: ""},
		secret: {type: String, default: ""},
		content: {type: mongoose.Schema.Types.Mixed},
	});

	Account.plugin(passport);
	Account.plugin(timestamp, {offset: 9});
	Account.plugin(grouped);

	const usernameToMail = (username: string): string => {
		return username;
	};

	// Public data
	Account.methods.public = function (cb: Callback<any>): IAccountPublic {
		const content: IAccountPublic = this.content;
		content.username = this.username;
		content.user_id = this.user_id;
		content.auth = this.auth;
		content.enabled = this.enabled;
		return content;
	};

	Account.methods._save = function (cb: Callback<any>): void {
		this.save(cb);
	};

	Account.methods.mail = function (cb: Callback<any>): string {
		let result: string = usernameToMail(this.username);
		if (this.content.mails) {
			if (this.content.mails.length > 0) { // メールアドレスが設定されていれば
				result = this.content.mails[0];
			}
		}
		return result;
	};

	Account.methods.get_status = function (cb: Callback<any>): number {
		return this.status;
	};

	Account.methods.set_status = function (status: number, cb: Callback<any>): void {
		this.status = status;
	};

	Account.statics.default_find_by_name_promise = function (user: IAccountModel, name: string): Promise<any> {
		return this.model("Account").findOne({username: name}).exec();
	};

	Account.statics.default_find_promise = function (user: IAccountModel, query: object, option: IQueryOption): Promise<any> {
		return this.model("Account").find(query, {}, option).exec();
	};

	Account.statics.set_by_name_promise = function (user: IAccountModel, name: string, setter: any): Promise<any> {
		return this.model("Account").findOneAndUpdate({username: name}, {$set: setter}, {upsert: false}).exec();
	};

	Account.statics.default_find_by_id_promise = function (user: IAccountModel, id: string): Promise<any> {
		return this.model("Account").findOne({user_id: id}).exec();
	};

	Account.statics.set_by_id_promise = function (user: IAccountModel, id: string, setter: any): Promise<any> {
		return this.model("Account").findOneAndUpdate({user_id: id}, {$set: setter}, {upsert: false}).exec();
	};

	Account.statics.remove_by_id_promise = function (user: IAccountModel, id: string): Promise<any> {
		return this.model("Account").findOneAndRemove({$and: [{auth: {$gt: 1}}, {user_id: id}]}).exec();
	};

	module.exports = mongoose.model("Account", Account);
}
