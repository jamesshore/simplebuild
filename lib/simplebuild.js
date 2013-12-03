// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

exports.createMapFunction = function(mapFn) {
	return function(module) {
		return exports.mapModule(module, mapFn);
	};
}

exports.mapModule = function(module, mapFn) {
	var result = {};
	Object.keys(module).forEach(function(key) {
		result[key] = mapFn(module[key]);
		mapDescriptors(module[key], result[key]);
	});
	return result;
}

function mapDescriptors(srcTask, destTask) {
	Object.keys(srcTask).forEach(function(key) {
		destTask[key] = srcTask[key];
	});
}