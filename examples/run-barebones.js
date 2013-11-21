// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var runningExt = require("./simplebuild-ext-running.js");
	var barebones = runningExt.wrap(require("./simplebuild-barebones.js"));

	console.log("\nRun succeed()");
	barebones.succeed({}, success, failure);

	console.log("\nRun fail()");
	barebones.fail({}, success, failure);

	console.log("\nRun succeedOrFail()");
	barebones.succeedOrFail({ fail: true }, success, failure);

	function success() {
		console.log("Succeeded!");
	}

	function failure(message) {
		console.log("Failed! " + message);
	}

}());