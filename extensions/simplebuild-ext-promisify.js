// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var simplebuild = require("../lib/simplebuild.js");
var Q = require("q");

// Turns every function in a simplebuild module into a promise.
exports.wrap = function(module) {
	return simplebuild.mapTaskModule(module, transform);
};

function transform(fn) {
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
