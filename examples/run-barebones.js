// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var barebones = require("./simplebuild-barebones.js");

	var runningExt = require("./simplebuild-ext-running.js");
	var headerExt = require("./simplebuild-ext-header.js");


	barebones = headerExt.addHeader(runningExt.wrap(barebones));
//	barebones = headerExt.addHeader(barebones);
//	barebones = runningExt.wrap(barebones);

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