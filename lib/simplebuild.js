// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

var path = require("path");

exports.createMapFunction = function(mapperFn) {
	return function(module) {
		if (typeof module === "string") module = require(module);

		if (Object.keys(module).length === 1 && module["map"]) return mapMapperModule(module, mapperFn);
		else return exports.mapTaskModule(module, mapperFn);
	};
}

function startsWith(string, substring) {
	return string.indexOf(substring) === 0;
}

function mapMapperModule(mapperModule, mapperFn) {
	return {
		map: function(module) {
			return exports.mapTaskModule(mapperModule.map(module), mapperFn);
		}
	}
}

exports.mapTaskModule = function(module, mapperFn) {
	var result = {};
	Object.keys(module).forEach(function(key) {
		result[key] = mapperFn(module[key]);
		mapDescriptors(module[key], result[key]);
	});
	return result;
}

function mapDescriptors(srcTask, destTask) {
	// only map descriptors that are defined in the spec; ignore everything else
	map("title");
	map("description");

	function map(descriptor) {
		if (destTask[descriptor] === undefined) destTask[descriptor] = srcTask[descriptor];
	}
}