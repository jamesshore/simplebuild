// Copyright (c) 2013-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

exports.that = function(variable, message) {
	if (message === undefined) message = "Expected condition to be true";

	if (variable === false) throw new EnsureException(exports.that, message);
	if (variable !== true) throw new EnsureException(exports.that, "Expected condition to be true or false");
};

exports.unreachable = function(message) {
	if (!message) message = "Unreachable code executed";

	throw new EnsureException(exports.unreachable, message);
};



exports.defined = function(variable, variableName) {
	if (variable === undefined) throw new EnsureException(exports.defined, normalize(variableName) + " was not defined");
};

exports.signature = function(args, signature) {
	signature = signature || [];
	var expectedArgCount = signature.length;
	var actualArgCount = args.length;

	if (actualArgCount > expectedArgCount) {
		throw new EnsureException(
			exports.signature,
			"Function called with too many arguments: expected " + expectedArgCount + " but got " + actualArgCount
		);
	}

	signature.forEach(function(type, i) {
		if (!Array.isArray(type)) type = [ type ];
		var arg = args[i];
		var name = "Argument #" + (i + 1);

		if (!typeMatches(type, arg, name)) {
			throw new EnsureException(
				exports.signature,
				name + " expected " + explainType(type) + ", but was " + explainArg(arg)
			);
		}
	});

	function typeMatches(type, arg) {
		for (var i = 0; i < type.length; i++) {
			if (oneTypeMatches(type[i], arg)) return true;
		}
		return false;

		function oneTypeMatches(type, arg) {
			switch (getType(arg)) {
				case "boolean": return type === Boolean;
				case "string": return type === String;
				case "number": return type === Number;
				case "array": return type === Array;
				case "function": return type === Function;
				case "object": return (typeof type === "function") && (arg instanceof type);
				case "undefined": return type === undefined;
				case "null": return type === null;
				case "NaN": return isNaN(type);

				default: exports.unreachable();
			}
		}
	}

	function explainType(type) {
		var joiner = "";
		var result = "";
		for (var i = 0; i < type.length; i++) {
			result += joiner + explainOneType(type[i]);
			joiner = (i === type.length - 2) ? ", or " : ", ";
		}
		return result;

		function explainOneType(type) {
			switch (type) {
				case Boolean: return "boolean";
				case String: return "string";
				case Number: return "number";
				case Array: return "array";
				case Function: return "function";
				case null: return "null";
				case undefined: return "undefined";
				default:
					if (typeof type === "number" && isNaN(type)) return "NaN";
					else return (type.name || "<anon>") + " instance";
			}
		}
	}

	function explainArg(arg) {
		var type = getType(arg);
		if (type !== "object") return type;

		var prototype = Object.getPrototypeOf(arg);
		if (prototype === null) return "an object without a prototype";
		else return (prototype.constructor.name || "<anon>") + " instance";
	}
};


exports.boolean = checkTypeFn("boolean");
exports.string = checkTypeFn("string");
exports.number = checkTypeFn("number");
exports.array = checkTypeFn("array");
exports.fn = checkTypeFn("function");

exports.object = function(variable, constructor, variableName) {
	checkTypeFn("object")(variable, variableName);
	if (constructor === undefined) return;

	if (!(variable instanceof constructor)) {
		var variablePrototype = Object.getPrototypeOf(variable);
		var constructorType = constructor.name;
		var variableType;

		constructorType = constructorType ? constructorType + " instance" : "a specific type";
		if (variablePrototype === null) {
			variableType = ", but it has no prototype";
		}
		else {
			variableType = variablePrototype.constructor.name;
			variableType = variableType ? ", but was " + variableType : "";
		}


		throw new EnsureException(exports.object, "Expected " + normalize(variableName) + " to be " + constructorType + variableType);
	}
};

function checkTypeFn(expectedType) {
	return function(variable, variableName) {
		var actualType = getType(variable);
		if (actualType !== expectedType) throw new EnsureException(exports.number, normalize(variableName) + " expected " + expectedType + ", but was " + actualType);
	};
}

function getType(variable) {
	var type = typeof variable;
	if (variable === null) type = "null";
	if (Array.isArray(variable)) type = "array";
	if (type === "number" && isNaN(variable)) type = "NaN";
	return type;
}

function normalize(variableName) {
	return variableName ? variableName : "variable";
}


var EnsureException = exports.EnsureException = function(fnToRemoveFromStackTrace, message) {
	if (Error.captureStackTrace) Error.captureStackTrace(this, fnToRemoveFromStackTrace);
	this.message = message;
};
EnsureException.prototype = Object.create(Error.prototype);
EnsureException.prototype.constructor = EnsureException;
EnsureException.prototype.name = "EnsureException";
