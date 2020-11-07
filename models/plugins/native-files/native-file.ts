/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IAccountModel} from "../../../types/platform/server";
import {Callback, IErrorObject, IQueryOption, IRights} from "../../../types/platform/universe";

import {INativeFileModelContent} from "../../../types/plugins/universe";
import {HeapProfiler} from "inspector";

namespace NativeFileModel {

	const mongoose: any = require("mongoose");

	const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");
	const grouped: any = require("../../../models/platform/plugins/grouped/grouped");
	const rights: any = require("../../../models/platform/plugins/rights/rights");

	const Schema: any = mongoose.Schema;

	const NativeFile = new Schema({
		user_id: {type: Schema.Types.ObjectId},
		filepath: {type: String, required: true, index: {unique: true}},
	});

	NativeFile.plugin(rights);
	NativeFile.plugin(timestamp, { offset: 9 });
	NativeFile.plugin(grouped);


	const query_by_user_read: any = (user: any, query: object): any => {
		let result = query;
		if (user) {
			result = {$and: [{user_id: {$eq: user.user_id}}, {"rights.read": {$gte: user.auth}}, query]};
		}
		return result;
	};

	const query_by_user_write: any = (user: any, query: object): any => {
		let result = query;
		if (user) {
			result = {$and: [{user_id: {$eq: user.user_id}}, {"rights.write": {$gte: user.auth}}, query]};
		}
		return result;
	};

	NativeFile.methods._create = function(user: IAccountModel, body: any, cb: Callback<any>): void {
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

	NativeFile.methods._save_promise = function(): Promise<any> {
		return this.save().exec();
	};

	NativeFile.statics.remove_by_id_promise = function(user: IAccountModel, filepath: string): Promise<any> {
		return this.model("NativeFile").findOneAndRemove(query_by_user_write(user,  {filepath: filepath})).exec();
	};

	NativeFile.statics.default_find_by_id_promise = function(user: IAccountModel, filepath: string): Promise<any> {
		return this.model("NativeFile").findOne(query_by_user_read(user,  {filepath: filepath})).exec();
	};

	NativeFile.statics.default_find_promise = function(user: IAccountModel, query: object, option: IQueryOption): Promise<any> {
		return this.model("NativeFile").find(query_by_user_read(user, query), {}, option).exec();
	};

	NativeFile.statics.default_count_promise = function(user: IAccountModel, query: object): Promise<any> {
		return this.model("NativeFile").countDocuments(query_by_user_read(user, query)).exec();
	};

	module.exports = mongoose.model("NativeFile", NativeFile);
}
