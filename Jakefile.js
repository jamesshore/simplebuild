// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var addHeader = require("./examples/simplebuild-ext-header.js").addHeader;

var jshint = addHeader(require("./tasks/simplebuild-jshint.js"));
var mocha = addHeader(require("./tasks/simplebuild-mocha.js"));

task("default", ["lint", "test"]);

desc("Lint everything");
task("lint", { async: true }, function() {
	jshint.validate({
		files: ["build.js", "tasks/simplebuild-jshint.js", "examples/run-barebones.js"],
		options: lintOptions(),
		globals: {}
	}, complete, fail)
});

desc("Test everything");
task("test", { async: true }, function() {
	mocha.runTests({
		files: ["tasks/jshint/_jshint_runner_test.js"]
	}, complete, fail);
});

function lintOptions() {
	return {
		bitwise: true,
		curly: false,
		eqeqeq: true,
		forin: true,
		immed: true,
		latedef: false,
		newcap: true,
		noarg: true,
		noempty: true,
		nonew: true,
		regexp: true,
		undef: true,
		strict: true,
		trailing: true,
		node: true
	};
}