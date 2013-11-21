// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var barebones = require("./simplebuild-barebones.js");

	console.log("Run succeed()");
	barebones.succeed({}, success, failure);

	console.log("Run fail()");
	barebones.fail({}, success, failure);

	console.log("Run succeedOrFail()");
	barebones.succeedOrFail({ fail: true }, success, failure);

	function success() {
		console.log("Succeeded!");
	}

	function failure(message) {
		console.log("Failed! " + message);
	}

}());