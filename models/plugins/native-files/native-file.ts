/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IAccountPublic, IErrorObject, IQueryOption} from "../../../types/platform/universe";

/*
*
* */
namespace NativeFileModel {

	const mongoose: any = require("mongoose");

	const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");
	const grouped: any = require("../../../models/platform/plugins/grouped/grouped");
	const rights: any = require("../../../models/platform/plugins/rights/rights");

	const Schema: any = mongoose.Schema;

	const NativeFile = new Schema({
		user_id: {type: Schema.Types.ObjectId},		// owner
		filepath: {type: String, required: true, index: {unique: true}}, 	// main key
		metadata: {
			username: String,
			relations: Object,
			rights: {
				read: Number,
				write: Number
			},
			type: String,
			count: Number,
			category: Number,
			description: String
		}
	});

	NativeFile.plugin(rights);		// 権限
	NativeFile.plugin(timestamp, {offset: 9});
	NativeFile.plugin(grouped);

	/*
	ユーザが一致するか、書き込み権限があるものを検索するクエリーを返す
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
			result = {$and: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}, query]};
		}
		return result;
	};

	NativeFile.methods._create = function (user: IAccountModel, body: any, cb: Callback<any>): void {
		this.user_id = user.user_id;
		this.filepath = body.filepath;
		this.model("NativeFile").findOne(query_by_user_write(user, {"filepath": this.filepath})).then((instance: any) => {
			if (!instance) {
				this.save(cb);
			} else {
				cb(null, null); // already
			}
		}).catch((error: IErrorObject) => {
			cb(error, null);
		});
	};

	// NativeFile.methods._save = function (): Promise<any> {
	// 	return this.save();
	// };

	NativeFile.methods.public = function (): any {
		return this;
	};

	NativeFile.statics.remove_by_id = function (user: IAccountModel, filepath: string): Promise<any> {
		return this.model("NativeFile").findOneAndRemove(query_by_user_write(user, {filepath: filepath}));
	};

	NativeFile.statics.default_find_by_id = function (user: IAccountModel, filepath: string): Promise<any> {
		return this.model("NativeFile").findOne(query_by_user_read(user, {filepath: filepath}));
	};

	NativeFile.statics.default_find = function (user: IAccountModel, query: object, option: IQueryOption): Promise<any> {
		return this.model("NativeFile").find(query_by_user_read(user, query), {}, option);
	};

	NativeFile.statics.default_count = function (user: IAccountModel, query: object): Promise<any> {
		return this.model("NativeFile").countDocuments(query_by_user_read(user, query));
	};

	module.exports = mongoose.model("NativeFile", NativeFile);
}
