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

				assert.equal(describe(Object), "Object instance");
				assert.equal(describe(RegExp), "RegExp instance");
				assert.equal(describe(MyClass), "MyClass instance");
				assert.equal(describe(AnonClass), "<anon> instance");
			});

			it("describes multiple types", function() {
				assert.equal(describe([ Boolean ]), "boolean", "one types");
				assert.equal(describe([ Boolean, Object ]), "boolean or Object instance", "two types");
				assert.equal(describe([ Boolean, Object, Number, Function ]), "boolean, Object instance, number, or function", "four types");

				assert.equal(describe([ undefined, Boolean ]), "undefined or boolean", "optional types shouldn't be treated specially");
				assert.equal(describe([ null, Object ]), "null or Object instance", "nullable objects shouldn't be treated specially");
			});

		});

	});

}());