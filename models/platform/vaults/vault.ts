/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */


"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IErrorObject, IQueryOption, IRights, IVaultModelContent} from "../../../types/platform/universe";

namespace VaultModel {

	const mongoose: any = require("mongoose");

	const crypto: any = require("crypto");

	const path: any = require("path");

	const models: string = global._models;
	const controllers: string = global._controllers;
	const library: string = global._library;
	const _config: string = global.__config;

	const Cipher: any = require(path.join(library, "cipher"));

	const timestamp: any = require(path.join(models, "platform/plugins/timestamp/timestamp"));
	const grouped: any = require(path.join(models, "platform/plugins/grouped/grouped"));
	const rights: any = require(path.join(models, "platform/plugins/rights/rights"));

	const Schema: any = mongoose.Schema;

	const Vault = new Schema({
		user_id: {type: String, default: ""},
		content: {
			id: {type: String, required: true, index: {unique: true}},
			parent_id: {type: String, default: ""},
			enabled: {type: Boolean, default: true},
			category: {type: String, default: ""},
			status: {type: Number, default: 0},
			type: {type: String, default: ""},
			value: {type: Schema.Types.Mixed},
			accessory: {type: Schema.Types.Mixed},
		},
	});

	Vault.plugin(rights);
	Vault.plugin(timestamp);
	Vault.plugin(grouped);

	Vault.index({"user_id": 1, "content.id": 1}, {unique: true});

	const setId = (id: string): string => {
		const idString = id.toString();
		const shasum = crypto.createHash("sha1");
		shasum.update(idString);
		return shasum.digest("hex");
	};

	const query_by_user_read: any = (user: any, query: object): any => {
	// 	return {$and: [{$or: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}]}, query]};
		return {$and: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}, query]};
	};

	const query_by_user_write: any = (user: any, query: object): any => {
	// 	return {$and: [{$or: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}]}, query]};
		return {$and: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}, query]};
	};

	const encode = (object: any, key: string): string => {
		return Cipher.FixedCrypt(JSON.stringify(object), key);
	};

	const decode = (cipherString: string, key: string): any => {
		return JSON.parse(Cipher.FixedDecrypt(cipherString, key));
	};

	const init = (_id: any, user_id: string, body: any, key: string): IVaultModelContent => {
		const content: IVaultModelContent = {
			id: setId(_id),
			parent_id: user_id,
			enabled: body.enabled,
			category: body.category,
			status: body.status,
			type: body.type,
			value: encode(body.value, key),
			accessory: body.accessory,
		};

		if (body.id) {
			content.id = body.id;
		}

		return content;
	};

	// Public data
	Vault.methods.public = function(key: string, cb: Callback<any>): any {
		const content = {value: {}};
		try {
			content.value = decode(this.content.value, key);
		} catch (error) {

		}
		return content;
	};

	Vault.methods._create = function(user: IAccountModel, key: string, body: any, cb: Callback<any>): void {
		try {
			this.user_id = user.user_id;
			this.content = init(this._id, this.user_id, body.content, key);
			this.model("Vault").findOne(query_by_user_write(user, {"content.id": this.content.id}), (error: IErrorObject, instance: any): void => {
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
		} catch (error) {
			cb({code: -2, message: "encode."}, null);
		}
	};

	Vault.methods._save = function(user: IAccountModel, cb: Callback<any>): void {
		this.markModified("Vault");
		this.save(cb);
	};

	Vault.statics.set_rights = function(user: IAccountModel, id: string, rights: IRights, cb: Callback<any>): void {
		const setter = {$set: {rights}};
		this.model("Vault").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}, cb);
	};

	Vault.statics.update_by_id = function(user: IAccountModel, key: string, id: string, content: any, cb: Callback<any>): void {
		try {
			const setter = {
				$set: {
					"content.enabled": content.enabled,
					"content.category": content.category,
					"content.status": content.status,
					"content.type": content.type,
					"content.value": encode(content.value, key),
					"content.accessory": content.accessory,
				},
			};

			this.model("Vault").findOneAndUpdate(query_by_user_write(user, {"content.parent_id": id}), setter, {upsert: false}, cb);
		} catch (error) {
			cb({code: -2, message: "encode."}, null);
		}
	};

	Vault.statics.set_by_id = function(user: IAccountModel, id: string, setter: any, cb: Callback<any>): void {
		this.model("Vault").findOneAndUpdate(query_by_user_write(user, {"content.parent_id": id}), setter, {upsert: false}, cb);
	};

	Vault.statics.remove_by_id = function(user: IAccountModel, id: string, cb: Callback<any>): void {
		this.model("Vault").findOneAndRemove(query_by_user_write(user, {"content.parent_id": id}), cb);
	};

	Vault.statics.default_find_by_id = function(user: IAccountModel, id: string, cb: Callback<any>): void {
		this.model("Vault").findOne(query_by_user_read(user, {"content.parent_id": id}), cb);
	};

	Vault.statics.default_find = function(user: IAccountModel, query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Vault").find(query_by_user_read(user, query), {}, option, cb);
	};

	Vault.statics.default_count = function(user: IAccountModel, query: object, cb: Callback<any>): void {
		this.model("Vault").countDocuments(query_by_user_read(user, query), cb);
	};

	Vault.statics.publish_find = function(query: object, option: IQueryOption, cb: Callback<any>): void {
		this.model("Vault").find(query, {}, option, cb);
	};

	Vault.statics.publish_count = function(query: object, cb: Callback<any>): void {
		this.model("Vault").countDocuments(query, cb);
	};

	Vault.statics.publish_find_by_id = function(id: string, cb: Callback<any>): void {
		this.model("Vault").findOne({"content.parent_id": id}, cb);
	};

	module.exports = mongoose.model("Vault", Vault);
}
