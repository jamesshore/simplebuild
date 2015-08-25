// Copyright (c) 2013-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var arrayToSentence = require("array-to-sentence");

	exports.check = function(arg, type) {
		if (!Array.isArray(type)) type = [ type ];

		for (var i = 0; i < type.length; i++) {
			if (oneTypeMatches(arg, type[i])) return true;
		}
		return false;

		function oneTypeMatches(arg, type) {
			switch (getType(arg)) {
				case "boolean": return type === Boolean;
				case "string": return type === String;
				case "number": return type === Number;
				case "array": return type === Array;
				case "function": return type === Function;
				case "object": return (typeof type === "function") && (arg instanceof type);
				case "undefined": return type === undefined;
				case "null": return type === null;
				case "NaN": return Number.isNaN(type);

				default: throw new Error("Unreachable code executed: " + getType(arg));
			}
		}
	};

	function getType(variable) {
		var type = typeof variable;
		if (variable === null) type = "null";
		if (Array.isArray(variable)) type = "array";
		if (Number.isNaN(variable)) type = "NaN";
		return type;
	}

	exports.describe = function(type) {
		if (!Array.isArray(type)) type = [ type ];

		var descriptions = type.map(function(oneType) {
			return describeOneType(oneType);
		});
		if (descriptions.length <= 2) return descriptions.join(" or ");
		else return arrayToSentence(descriptions, { lastSeparator: ", or " }); // dat Oxford comma

		function describeOneType(type) {
			switch(type) {
				case Boolean: return "boolean";
				case String: return "string";
				case Number: return "number";
				case Function: return "function";
				case Array: return "array";
				case undefined: return "undefined";
				case null: return "null";

				default:
					if (Number.isNaN(type)) return "NaN";
					else if (typeof type === "function") return describeObject(type);
					else throw new Error("unrecognized type: " + type);
			}
		}

		function describeObject(type) {
			return (type.name || "<anon>") + " instance";
		}

	};

}());
