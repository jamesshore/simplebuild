// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

//var jshint = require("./tasks/simplebuild-jshint.js");
//var mocha = require("./tasks/simplebuild-mocha.js");

module.exports = function(grunt) {

	var simplebuild = require("./extensions/simplebuild-ext-gruntify.js")(grunt);

	grunt.initConfig({
		JSHint: {
			files: ["build.js", "tasks/simplebuild-jshint.js", "examples/run-barebones.js"],
			options: lintOptions(),
			globals: {}
		},

		Mocha: {
			files: ["tasks/jshint/_jshint_runner_test.js"]
		}
	});

	simplebuild.loadNpmTasks("./tasks/simplebuild-jshint");
	simplebuild.loadNpmTasks("./tasks/simplebuild-mocha");


	grunt.registerTask("default", "Lint and test", ["JSHint", "Mocha"]);

//	grunt.registerTask("jshint", "Lint everything", function() {
//		jshint.validate(grunt.config("jshint"), this.async(), grunt.warn);
//	});
//
//	grunt.registerTask("mocha", "Test everything", function() {
//		mocha.runTests(grunt.config("mocha"), this.async(), grunt.warn);
//	});

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

};