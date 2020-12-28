/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

module.exports = exports = function GroupedPlugin(schema: any, options: any) {

	schema.add({group: String});

	schema.pre("init", function(object: any) {
	});

	schema.post("init", function(doc: any) {
	});

	schema.pre("validate", function() {
	});

	schema.post("validate", function(doc: any) {
	});

	schema.pre("save", function(next: any) {
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
