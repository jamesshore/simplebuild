// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var simplebuild = require("../lib/simplebuild.js");

// Adds a Jake-compatible 'task()' function to every function in a simplebuild module.
exports.wrap = function(module) {
	return simplebuild.mapModule(module, transform);
};

function transform(fn) {
	fn.task = function(taskName, dependencies, options) {
		if (arguments.length === 2) {  // 'dependencies' is optional
			options = dependencies;
			dependencies = [];
		}

		task(taskName, dependencies, { async: true }, function() {
			fn(options, complete, fail);
		});
	}

	return fn;
}


//task("test", { async: true }, function() {
//	mocha.runTests({
//		files: ["tasks/jshint/_jshint_runner_test.js"]
//	}, complete, fail);
//});
