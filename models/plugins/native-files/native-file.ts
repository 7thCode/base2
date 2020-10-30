/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IErrorObject, IQueryOption, IRights} from "../../../types/platform/universe";

import {INativeFileModelContent} from "../../../types/plugins/universe";

namespace NativeFileModel {

	const mongoose: any = require("mongoose");

	const crypto: any = require("crypto");

	const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");
	const grouped: any = require("../../../models/platform/plugins/grouped/grouped");
	const rights: any = require("../../../models/platform/plugins/rights/rights");

	const Schema: any = mongoose.Schema;

	const NativeFile = new Schema({
	// 	user_id: {type: String, default: ""},
		user_id: {type: Schema.Types.ObjectId},
		username: {type: String, default: ""},
		filepath: {type: String, default: ""},
		content: {
			id: {type: Schema.Types.ObjectId, required: true, index: {unique: true}},
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

	NativeFile.plugin(rights);
	NativeFile.plugin(timestamp, { offset: 9 });
	NativeFile.plugin(grouped);

	NativeFile.index({"user_id": 1, "content.id": 1}, {unique: true});

	// const setId = (id: string): string => {
	// 	const idString = id.toString();
	// 	const shasum = crypto.createHash("sha1");
	// 	shasum.update(idString);
	// 	return shasum.digest("hex");
	// };

	const query_by_user_read: any = (user: any, query: object): any => {
		// return {$and: [{$or: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}]}, query]};
		let result = query;
		if (user) {
			result = {$and: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}, query]};
		}
		return result;
	};

	const query_by_user_write: any = (user: any, query: object): any => {
		// return {$and: [{$or: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}]}, query]};
		let result = query;
		if (user) {
			result = {$and: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}, query]};
		}
		return result;
	};

	const init: any = (_id: any, body: any): INativeFileModelContent => {
		const id = new mongoose.Types.ObjectId();
		const content: INativeFileModelContent = {
			id:  id, // setId(_id),
			parent_id: body.parent_id,
			enabled: body.enabled,
			category: body.category,
			status: body.status,
			type: body.type,
			name: body.name,
			value: body.value,
			accessory: body.accessory,
		};

		return content;
	};

	// Public data
	NativeFile.methods.public = function(cb: Callback<any>): any {
		return this.content;
	};

	NativeFile.methods._create = function(user: IAccountModel, body: any, cb: Callback<any>): void {
		this.user_id = user.user_id;
		this.username = user.username;
		this.content = init(this._id, body.content);
		this.model("NativeFile").findOne(query_by_user_write(user, {"content.id": this.content.id})).then((instance: any) => {
				if (!instance) {
					this.save(cb);
				} else {
					cb(null, null); // rlready
				}
		}).catch((error: IErrorObject) => {
			cb(error, null);
		});
	};

	NativeFile.methods._save_promise = function(): Promise<any> {
		return this.save().exec();
	};

	NativeFile.statics.set_rights_promise = function(user: IAccountModel, id: string, rights: IRights): Promise<any> {
		const setter = {$set: {rights}};
		return this.model("NativeFile").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}).exec();
	};

	NativeFile.statics.update_by_id_promise = function(user: IAccountModel, id: string, content: any): Promise<any> {
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
		return this.model("NativeFile").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}).exec();
	};

	NativeFile.statics.set_by_id_promise = function(user: IAccountModel, id: string, setter: object): Promise<any> {
		return this.model("NativeFile").findOneAndUpdate(query_by_user_write(user, {"content.id": id}), setter, {upsert: false}).exec();
	};

	NativeFile.statics.remove_by_id_promise = function(user: IAccountModel, id: string): Promise<any> {
		return this.model("NativeFile").findOneAndRemove(query_by_user_write(user, {"content.id": id})). exec();
	};

	NativeFile.statics.default_find_by_id_promise = function(user: IAccountModel, id: string): Promise<any> {
		return this.model("NativeFile").findOne(query_by_user_read(user, {"content.id": id})).exec();
	};

	NativeFile.statics.default_find_promise = function(user: IAccountModel, query: object, option: IQueryOption): Promise<any> {
		return this.model("NativeFile").find(query_by_user_read(user, query), {}, option).exec();
	};

	NativeFile.statics.default_count_promise = function(user: IAccountModel, query: object): Promise<any> {
		return this.model("NativeFile").countDocuments(query_by_user_read(user, query)).exec();
	};

	NativeFile.statics.publish_find_promise = function(query: object, option: IQueryOption): Promise<any> {
		return this.model("NativeFile").find(query, {}, option);
	};

	NativeFile.statics.publish_count_promise = function(query: object): Promise<any> {
		return this.model("NativeFile").countDocuments(query).exec();
	};

	NativeFile.statics.publish_find_by_id_promise = function(id: string): Promise<any> {
		return this.model("NativeFile").findOne({"content.id": id}).exec();
	};

	module.exports = mongoose.model("NativeFile", NativeFile);
}
