"use strict";

import {IQueryOption} from "../../../types/platform/universe";
import {IAccountModel} from "../../../types/platform/server";

namespace RelationModel {

	const mongoose: any = require("mongoose");

	const Schema: any = mongoose.Schema;

	const Relation = new Schema({
		from_id: {type: Schema.Types.ObjectId},
		to_id: {type: Schema.Types.ObjectId},
		type: {type: String, default: ""},
		enabled: {type: Boolean, default: true},
	});

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
		return this.model("Relation").remove({$or: [{$and: [{from_id: id_1}, {to_id: id_2}, {type: type}]}, {$and: [{to_id: id_1}, {from_id: id_2}, {type: type}]}]});
	};

	Relation.statics.set_enabled = function(from_id: any, to_id: any, type: string, enabled: boolean): Promise<any> {
		const setter: {$set: any} = {$set: {enabled: enabled}};
		return this.model("Article").findOneAndUpdate({$and: [{from_id: from_id}, {to_id: to_id}, {type: type}]}, setter, {upsert: false});
	};

	module.exports = mongoose.model("Relation", Relation);

}
