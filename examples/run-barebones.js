// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

//	var extensions = require("./simplebuild-ext-header.js")
//		.wrap("./simplebuild-ext-running.js");
//
//	var barebones = extensions.wrap("./simplebuild-ext-barebones.js");


	var headerExt = require("./simplebuild-ext-header.js");
	var runningExt = require("./simplebuild-ext-running.js");
	var barebones = require("./simplebuild-barebones.js");

	barebones = headerExt.map(runningExt.map(barebones));

	barebones.succeed({}, success, failure);
	barebones.fail({}, success, failure);
	barebones.succeedOrFail({ fail: true }, success, failure);

	function success() {
		console.log("Succeeded!");
	}

	function failure(message) {
		console.log("Failed! " + message);
	}

}());