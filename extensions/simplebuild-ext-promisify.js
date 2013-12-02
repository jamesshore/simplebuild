// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var Q = require("q");

// A Simplebuild extension that takes a Simplebuild module and turns every function into a promise.
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
	console.log("Transformed " + fn.title);
	return function(options) {
		var deferred = Q.defer();
		fn(options, function success() {
			deferred.resolve();
		}, function failure(reason) {
			deferred.reject(reason)
		});
		return deferred.promise;
	}
}
