// Copyright (c) 2013-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var arrayToSentence = require("array-to-sentence");

	exports.check = function(arg, type) {
		var argType = getType(arg);
		if (!Array.isArray(type)) type = [ type ];

		var matches = type.some(function(oneType) {
			return oneTypeMatches(argType, oneType);
		});

		if (matches) return null;
		else return describeError(argType, type);


		function oneTypeMatches(argType, type) {
			if (argType === Object) return checkObject(arg, type);
			else if (Number.isNaN(argType)) return Number.isNaN(type);
			else return argType === type;
		}

		function checkObject(arg, type) {
			if (typeof type === "function") return arg instanceof type;
			return checkStruct(arg, type);
		}

		function checkStruct(arg, type) {
			if (typeof type !== "object") throw new Error("unrecognized type: " + type);
			return Object.getOwnPropertyNames(type).every(function(key) {
				return exports.check(arg[key], type[key]) === null;
			});
		}

		function describeError(argType, type) {
			var describe = exports.describe;
			var articles = { articles: true };
			return "argument must be " + describe(type, articles) + ", but it was " + describe(argType, articles);
		}

	};


	exports.describe = function(type, options) {
		if (!Array.isArray(type)) type = [ type ];
		if (options === undefined) options = {};

		var descriptions = type.map(function(oneType) {
			return describeOneType(oneType);
		});
		if (descriptions.length <= 2) return descriptions.join(" or ");
		else return arrayToSentence(descriptions, { lastSeparator: ", or " }); // dat Oxford comma

		function describeOneType(type) {
			switch(type) {
				case Boolean: return options.articles ? "a boolean" : "boolean";
				case String: return options.articles ? "a string" : "string";
				case Number: return options.articles ? "a number" : "number";
				case Function: return options.articles ? "a function" : "function";
				case Array: return options.articles ? "an array" : "array";
				case undefined: return "undefined";
				case null: return "null";

				default:
					if (Number.isNaN(type)) return "NaN";
					else if (typeof type === "function") return describeObject(type, options);
					else if (typeof type === "object") return describeStruct(type, options);
					else throw new Error("unrecognized type: " + type);
			}
		}

		function describeObject(type, options) {
			var articles = options.articles;

			if (type === Object) return articles ? "an object" : "object";
			else if (type === RegExp) return articles ? "a regular expression" : "regular expression";

			var name = type.name;
			if (name) {
				if (articles) name = "a " + name;
			}
			else {
				name = articles ? "an <anon>" : "<anon>";
			}
			return name + " instance";
		}

		function describeStruct(type, options) {
			var properties = Object.getOwnPropertyNames(type).map(function(key) {
				return key + ": <" + exports.describe(type[key]) + ">";
			});

			if (properties.length === 0) return options.articles ? "an object" : "object";

			var description = " " + properties.join(", ") + " ";
			return (options.articles ? "an " : "") + "object containing {" + description + "}";
		}

	};

	function getType(variable) {
		if (variable === null) return null;
		if (Array.isArray(variable)) return Array;
		if (Number.isNaN(variable)) return NaN;

		switch (typeof variable) {
			case "boolean": return Boolean;
			case "string": return String;
			case "number": return Number;
			case "function": return Function;
			case "object": return Object;
			case "undefined": return undefined;

			default:
				throw new Error("Unreachable code executed. Unknown typeof value: " + typeof variable);
		}
	}

}());