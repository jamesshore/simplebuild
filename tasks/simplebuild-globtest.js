// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var simplebuild = require("../lib/simplebuild.js");

exports.log = function(options, success, failure) {
	console.log(simplebuild.deglobSync(options.glob));
	success();
};

exports.log.title = "Globtest";
exports.log.description = "Expand a glob array and display the results to the console.";