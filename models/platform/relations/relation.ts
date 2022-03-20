/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IQueryOption} from "../../../types/platform/universe";
import {IAccountModel} from "../../../types/platform/server";

namespace RelationModel {

	const mongoose: any = require("mongoose");

	// const timestamp: any = require("../../../models/platform/plugins/timestamp/timestamp");

	const Schema: any = mongoose.Schema;

	const Relation = new Schema({
		from_id: {type: Schema.Types.ObjectId},
		to_id: {type: Schema.Types.ObjectId},
		type: {type: String, default: ""},
		enabled: {type: Boolean, default: true},
	});

	// Relation.plugin(timestamp, {offset: 9});

	Relation.index({"from_id": 1, "to_id": 1, "type": 1}, {unique: true});

	Relation.statics.default_find = function (query: any, option: IQueryOption): Promise<any> {
		return this.model("Relation").find(query, {}, option);
	};

	Relation.statics.default_find_one = function (query: any): Promise<any> {
		return this.model("Relation").findOne(query);
	};

	Relation.statics.related = function (from_id: any, to_id: any, type: string): Promise<any> {
		return this.model("Relation").findOne({$and: [{from_id: from_id}, {to_id: to_id}, {type: type}]});
	};

	Relation.statics.cancel = function (from_id: any, to_id: any, type: string): Promise<any> {
		return this.model("Relation").findOneAndRemove({$and: [{from_id: from_id}, {to_id: to_id}, {type: type}]});
	};

	Relation.statics.break = function (id_1: any, id_2: any, type: string): Promise<any> {
		return this.model("Relation").deleteMany({$or: [{$and: [{from_id: id_1}, {to_id: id_2}, {type: type}]}, {$and: [{to_id: id_1}, {from_id: id_2}, {type: type}]}]});
	};

	Relation.statics.delete = function (id: any): Promise<any> {
		return this.model("Relation").deleteMany({$or: [{from_id: id}, {to_id: id}]});
	};

	Relation.statics.set_type = function(from_id: any, to_id: any, org_type: string, new_type: string): Promise<any> {
		const setter: {$set: any} = {$set: {type: new_type}};
		return this.model("Relation").findOneAndUpdate({$and: [{from_id: from_id}, {to_id: to_id}, {type: org_type}]}, setter, {upsert: false});
	};

	Relation.statics.set_enabled = function(from_id: any, to_id: any, type: string, enabled: boolean): Promise<any> {
		const setter: {$set: any} = {$set: {enabled: enabled}};
		return this.model("Relation").findOneAndUpdate({$and: [{from_id: from_id}, {to_id: to_id}, {type: type}]}, setter, {upsert: false});
	};

	module.exports = mongoose.model("Relation", Relation);

}
