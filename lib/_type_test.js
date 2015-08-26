// Copyright (c) 2013-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var assert = require("./assert.js");
	var type = require("./type.js");

	describe("Type", function() {

		describe("checker", function() {

			var check = type.check;

			it("checks built-in types", function() {
				assert.isTrue(check(false, Boolean), "boolean");
				assert.isFalse(check(false, String), "not boolean");

				assert.isTrue(check("1", String), "string");
				assert.isFalse(check("1", Number), "not string");

				assert.isTrue(check(1, Number), "number");
				assert.isFalse(check(1, Function), "not number");

				assert.isTrue(check(function() {}, Function), "function");
				assert.isFalse(check(function() {}, Object), "not function");

				assert.isTrue(check({}, Object), "object");
				assert.isFalse(check({}, Array), "not object");

				assert.isTrue(check([], Array), "array");
				assert.isFalse(check([], RegExp), "not array");

				assert.isTrue(check(/foo/, RegExp), "regular expression");
				assert.isFalse(check(/foo/, Boolean), "not regular expression");
			});

			it("checks undefined and null types (primarily for allowing nullable objects, etc.)", function() {
				assert.isTrue(check(undefined, undefined), "undefined");
				assert.isFalse(check(undefined, null), "not undefined");

				assert.isTrue(check(null, null), "null");
				assert.isFalse(check(null, NaN), "not null");
			});

			it("checks NaN (just in case you ever want it)", function() {
				assert.isTrue(check(NaN, NaN), "NaN");

				assert.isFalse(check(NaN, undefined), "undefined should not be NaN");
				assert.isFalse(check(NaN, null), "null should not be NaN");
				assert.isFalse(check(NaN, Object), "constructors should not be NaN");
			});

			it("checks custom types", function() {
				function MyClass() {}

				var myInstance = new MyClass();

				assert.isTrue(check(myInstance, MyClass), "instance of class");
				assert.isTrue(check(myInstance, Object), "instance of subclass");
				assert.isFalse(check({}, MyClass), "instance of superclass");
			});

			it("checks 'structs'", function() {
				assert.isTrue(check({ a: 1 }, { a: Number }), "one matching parameter");
				assert.isFalse(check({ a: 1 }, { a: String }), "one non-matching parameter");

				assert.isTrue(check({}, {}), "no parameters");
				assert.isTrue(check({ a: 1 }, {}), "extra parameters should be ignored");

				assert.isTrue(check({ a: 1, b: "a" }, { a: Number, b: String }), "multiple matching parameters");
				assert.isFalse(check({ a: 1, b: "a" }, { a: Number, b: Number }), "multiple with non-matching parameter");
			});

			it("supports multiple allowed types", function() {
				assert.isTrue(check(1, [String, Number]), "string or number");
				assert.isFalse(check(1, [String, Object, Boolean]), "not string, object, or boolean");
			});

		});

		describe("describer", function() {

			var describe = type.describe;

			it("describes non-object types", function() {
				assert.equal(describe(Boolean), "boolean");
				assert.equal(describe(String), "string");
				assert.equal(describe(Number), "number");
				assert.equal(describe(Function), "function");
				assert.equal(describe(Array), "array");
				assert.equal(describe(undefined), "undefined");
				assert.equal(describe(null), "null");
				assert.equal(describe(NaN), "NaN");
			});

			it("describes object types", function() {
				function MyClass() {}
				var AnonClass = function() {};

				assert.equal(describe(Object), "object");
				assert.equal(describe(RegExp), "regular expression");
				assert.equal(describe(MyClass), "MyClass instance");
				assert.equal(describe(AnonClass), "<anon> instance");
			});

			it ("describes 'structs'", function() {
				assert.equal(describe({}), "object", "empty object");
				assert.equal(describe({ a: Number }), "object containing { a: <number> }", "one parameter");
				assert.equal(describe({ a: Number, b: String }), "object containing { a: <number>, b: <string> }");
			});

			it("describes multiple types", function() {
				assert.equal(describe([ Boolean ]), "boolean", "one types");
				assert.equal(describe([ Boolean, Object ]), "boolean or object", "two types");
				assert.equal(describe([ Boolean, Object, Number, Function ]), "boolean, object, number, or function", "four types");

				assert.equal(describe([ undefined, Boolean ]), "undefined or boolean", "optional types shouldn't be treated specially");
				assert.equal(describe([ null, Object ]), "null or object", "nullable objects shouldn't be treated specially");
			});

			it("optionally uses articles", function() {
				var options = { articles: true };

				assert.equal(describe(Boolean, options), "a boolean");
				assert.equal(describe(String, options), "a string");
				assert.equal(describe(Number, options), "a number");
				assert.equal(describe(Function, options), "a function");
				assert.equal(describe(Array, options), "an array");
				assert.equal(describe(undefined, options), "undefined");
				assert.equal(describe(null, options), "null");
				assert.equal(describe(NaN, options), "NaN");
				assert.equal(describe(Object, options), "an object", "Object");
				assert.equal(describe(RegExp, options), "a regular expression");
				assert.equal(describe(function MyClass() {}, options), "a MyClass instance");
				assert.equal(describe(function() {}, options), "an <anon> instance");
				assert.equal(describe({}, options), "an object", "{}");
				assert.equal(describe({ a: Number }, options), "an object containing { a: <number> }");
			});

		});

	});

}());