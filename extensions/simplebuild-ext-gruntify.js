// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var simplebuild = require("../lib/simplebuild.js");

module.exports = function(grunt) {

	var gruntExports = {};

	gruntExports.loadNpmTasks = function(moduleName) {
		console.log("Loading " + moduleName);

		var module = require("../" + moduleName);
		simplebuild.mapModule(module, transform);
	};

	return gruntExports;


	function transform(fn) {
		console.log("Transforming " + fn.title);

		grunt.registerTask(fn.title, fn.description, function() {
			console.log("Running " + fn.title);
			fn(grunt.config(fn.title), this.async(), grunt.warn);
		})

		return fn;
	}
};


//// Adds a Jake-compatible 'task()' function to every function in a simplebuild module.
//exports.wrap = function(module) {
//	return simplebuild.mapModule(module, transform);
//};
//
//function transform(fn) {
//	fn.task = function(taskName, dependencies, options) {
//		if (!jake) throw new Error("Jake global not found. Are you running Jake?");
//
//		if (arguments.length === 2) {  // 'dependencies' is optional
//			options = dependencies;
//			dependencies = [];
//		}
//
//		task(taskName, dependencies, { async: true }, function() {
//			fn(options, complete, fail);
//		});
//	}
//
//	return fn;
//}
