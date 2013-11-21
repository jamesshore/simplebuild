// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	// A Simplebuild extension that takes a Simplebuild module and wraps every function in a "running... done" message.
	exports.wrap = function(module) {
		var result = {};
		Object.keys(module).forEach(function(key) {
			result[key] = transform(module[key]);
			result[key].title = module[key].title;
			result[key].description = module[key].description;
		});
		return result;
	};

	function transform(fn) {
		return function(options, success, failure) {
			console.log("Running...");
			fn(options, done(success), done(failure));
		};

		function done(fn) {
			return function() {
				console.log("...done.");
				fn.apply(this, arguments);
			};
		}
	}

}());