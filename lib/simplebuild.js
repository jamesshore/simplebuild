// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

exports.mapModule = function(module, mapFn) {
	var result = {};
	Object.keys(module).forEach(function(key) {
		result[key] = mapFn(module[key]);
		result[key].title = module[key].title;
		result[key].description = module[key].description;
	});
	return result;
}
