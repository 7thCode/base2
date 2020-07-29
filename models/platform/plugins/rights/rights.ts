/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */
module.exports = exports = function RightsPlugin(schema: any, options: any) {

	schema.add({rights: {read: Number, write: Number}});

	schema.pre("init", function(object: any) {
	});

	schema.post("init", function(doc: any) {
	});

	schema.pre("validate", function() {
	});

	schema.post("validate", function(doc: any) {
	});

	schema.pre("save", function(next: any) {
		this.rights = {read: 100000, write: 200};
		next();
	});

	schema.post("save", function(doc: any) {
	});

	// triggered at "findOneAndRemove" only.
	schema.pre("remove", function(next: any) {
		next();
	});

	schema.post("remove", function(doc: any) {
	});

	schema.pre("update", function() {
	});

};
