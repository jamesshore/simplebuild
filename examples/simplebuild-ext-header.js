// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	// A Simplebuild extension that adds a header to Simplebuild modules.
	exports.addHeader = function(module) {
		var result = {};
		Object.keys(module).forEach(function(key) {
			result[key] = transform(module[key]);
		});
		return result;
	};

	function transform(fn) {
		return function(options, success, failure) {
			var underline = new Array(fn.title.length + 1).join("=");

			console.log();
			console.log(fn.title);
			console.log(underline);
			fn(options, success, failure);
		};
	}

}());