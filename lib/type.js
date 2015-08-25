// Copyright (c) 2013-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

exports.check = function checkType(arg, type) {
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



//exports.signature = function(args, signature) {
//	signature = signature || [];
//	var expectedArgCount = signature.length;
//	var actualArgCount = args.length;
//
//	if (actualArgCount > expectedArgCount) {
//		throw new EnsureException(
//			exports.signature,
//			"Function called with too many arguments: expected " + expectedArgCount + " but got " + actualArgCount
//		);
//	}
//
//	signature.forEach(function(type, i) {
//		if (!Array.isArray(type)) type = [ type ];
//		var arg = args[i];
//		var name = "Argument #" + (i + 1);
//
//		if (!typeMatches(type, arg, name)) {
//			throw new EnsureException(
//				exports.signature,
//				name + " expected " + explainType(type) + ", but was " + explainArg(arg)
//			);
//		}
//	});
//
//	function explainType(type) {
//		var joiner = "";
//		var result = "";
//		for (var i = 0; i < type.length; i++) {
//			result += joiner + explainOneType(type[i]);
//			joiner = (i === type.length - 2) ? ", or " : ", ";
//		}
//		return result;
//
//		function explainOneType(type) {
//			switch (type) {
//				case Boolean: return "boolean";
//				case String: return "string";
//				case Number: return "number";
//				case Array: return "array";
//				case Function: return "function";
//				case null: return "null";
//				case undefined: return "undefined";
//				default:
//					if (typeof type === "number" && isNaN(type)) return "NaN";
//					else return (type.name || "<anon>") + " instance";
//			}
//		}
//	}
//
//	function explainArg(arg) {
//		var type = getType(arg);
//		if (type !== "object") return type;
//
//		var prototype = Object.getPrototypeOf(arg);
//		if (prototype === null) return "an object without a prototype";
//		else return (prototype.constructor.name || "<anon>") + " instance";
//	}
//};

//function checkTypeFn(expectedType) {
//	return function(variable, variableName) {
//		var actualType = getType(variable);
//		if (actualType !== expectedType) throw new EnsureException(exports.number, normalize(variableName) + " expected " + expectedType + ", but was " + actualType);
//	};
//}
//
//function normalize(variableName) {
//	return variableName ? variableName : "variable";
//}
