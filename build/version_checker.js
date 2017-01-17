// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var semver = require("semver");

	exports.check = function(options, success, fail) {
		if (options.strict) {
			if (semver.neq(options.actual, options.expected)) return failWithQualifier("exactly");
		}
		else {
			if (semver.lt(options.actual, options.expected)) return failWithQualifier("at least");
			if (semver.neq(options.actual, options.expected)) console.log("Warning: Newer " + options.name +
				" version than expected. Expected " + options.expected + ", but was " + options.actual + ".");
		}
		return success();

		function failWithQualifier(qualifier) {
			return fail("Incorrect " + options.name + " version. Expected " + qualifier +
				" " + options.expected + ", but was " + options.actual + ".");
		}
	};

}());