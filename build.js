// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var jshint = require("./tasks/simplebuild-jshint.js");
jshint = require("./examples/simplebuild-ext-header.js").addHeader(jshint);

jshint.validate({
	files: ["build.js", "tasks/simplebuild-jshint.js", "examples/run-barebones.js"],
	options: lintOptions(),
	globals: {}
}, function() {
	console.log("\n\nOK");
}, function() {
	console.log("\n\nFAILED!");
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