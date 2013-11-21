// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	// A bare-bones Simplebuild module to demonstrate how it works.

	exports.succeed = function(options, success, failure) {
		success();
	};

	exports.fail = function(options, success, failure) {
		failure("Failed, as requested");
	};

	// `options` should have a `fail` parameter (default false) that determines whether the task
	// succeeds or fails.
	exports.succeedOrFail = function(options, success, failure) {
		if (options.fail) failure("Failed, as configured");
		else success();
	};

}());