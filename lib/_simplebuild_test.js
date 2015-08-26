// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var assert = require("./assert.js");
	var simplebuild = require("./simplebuild.js");
	var type = require("./type.js");

	describe("Simplebuild API", function() {

		describe("normalizeOptions()", function() {

			var normalize = simplebuild.normalizeOptions;

			it("checks options' types", function() {
				assert.isNull(normalize({}, { a: 1 }, { a: Number }), "matches");
			});

			it("returns an error message when types don't match", function() {
				assert.equal(normalize({}, { a: "a" }, { a: Number }), "options.a must be a number, but it was a string");
			});

			it("copies default values into options without overriding originals", function() {
				var userOptions = { a: 1, c: 3 };
				var defaults = { b: 2, c: "XX" };
				normalize(defaults, userOptions, {});

				assert.deepEqual(defaults, { a: 1, b: 2, c: 3 });
			});

			it("applies defaults before checking types", function() {
				var userOptions = {};
				var defaults = { a: 1 };
				var types = { a: Number };

				assert.isNull(normalize(defaults, userOptions, types));
			});

		});

	});

}());


/*
	types = {
		files: [ String, Array ],
		options: Object,
		globals: Object
	};
	defaults = {
		options: {},
		globals: {}
	};
	errors = {

	}

	var options = { a: c

	var optionsError = simplebuild.normalizeOptions(opts, types, defaults);
	if (optionsError) return fail(optionError);


exports.checkFiles = function checkFiles(opts, success, failure) {
	"options must be an object matching { files: <string or array>, options: <object>, globals: <object> }, but it was undefined."
	"options.file must be a string or an array, but it was undefined."
	"options.options must be an object, but it was a number."
};
//exports.checkFiles.descriptors = messages.FILE_LIST_VALIDATOR_DESCRIPTORS;

*/
