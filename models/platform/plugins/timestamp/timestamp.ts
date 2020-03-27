/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

const moment: any = require("moment-timezone");

module.exports = exports = function lastModifiedPlugin(schema: any, options: any) {

	const localtime = () => {
		return moment().add(options.offset, 'hours');
	};

	schema.add({create: Date});
	schema.add({modify: Date});

	schema.pre("init", function(object: any) {
		//  next();
	});

	schema.post("init", function(doc: any) {
	});

	schema.pre("validate", function() {
		//  next();
	});

	schema.post("validate", function(doc: any) {
	});

	schema.pre("save", function(next: () => void) {
		if (!this.create) {
		// 	this.create = new Date();
		 	this.create = localtime();
		}

	 // 	this.modify = new Date();
	 	this.modify = localtime();
		next();
	});

	schema.post("save", function(doc: any) {
	});

	schema.pre("update", function(next: () => void) {
	// 	this.update({}, {$set: {modify: new Date()}});
	 	this.update({}, {$set: {modify: localtime()}});
		next();
	});

	schema.post("update", function(doc: any) {
	});

	schema.pre(["updateOne", "findOneAndUpdate"], function(next: () => void) {
 	// 	this.update({}, {$set: {modify: new Date()}});
	 	this.update({}, {$set: {modify: localtime()}});
		next();
	});

	schema.post(["updateOne", "findOneAndUpdate"], function(doc: any) {
	});

	// triggered at "findOneAndRemove" only.
	schema.pre(["remove", "findOneAndRemove"], function(next: () => void) {
		next();
	});

	schema.post(["remove", "findOneAndRemove"], function(doc: any) {
	});

	if (options) {
		if (options.index) {
			schema.path("create").index(options.index);
			schema.path("modify").index(options.index);
		}
	}

};
