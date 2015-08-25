// Copyright (c) 2013-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
(function() {
	"use strict";

	var assert = require("./assert.js");
	var type = require("./type.js");
	var EnsureException = type.EnsureException;

	describe("Type checker", function() {

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


//describe("Ensure", function() {
//
//	describe.skip("type checking", function() {
//
//		it("checks if variable is defined", function() {
//			var defined = wrap(ensure.defined);
//
//			assert.noException(defined("foo"));
//			assert.noException(defined(null));
//			assert.exception(defined(undefined), /variable was not defined/);
//			assert.exception(defined(undefined, "myVariable"), /myVariable was not defined/);
//		});
//
//		it("checks if variable is number, string, or array", function() {
//			var number = wrap(ensure.number);
//			var string = wrap(ensure.string);
//			var array = wrap(ensure.array);
//			var fn = wrap(ensure.fn);
//
//			assert.noException(number(0));
//			assert.exception(number("foo"), /variable expected number, but was string/);
//			assert.exception(number({}), /variable expected number, but was object/);
//			assert.exception(number([]), /variable expected number, but was array/);
//			assert.exception(number(undefined), /variable expected number, but was undefined/);
//			assert.exception(number(null), /variable expected number, but was null/);
//			assert.exception(number(NaN), /variable expected number, but was NaN/);
//
//			assert.exception(number("foo", "name"), /name expected number, but was string/);
//
//			assert.exception(string(null, "name"), /name expected string, but was null/);
//			assert.exception(array(null, "name"), /name expected array, but was null/);
//			assert.exception(fn(null, "name"), /name expected function, but was null/);
//		});
//
//		it("checks if variable is object of specific type", function() {
//			function Example1() {}
//
//			function Example2() {}
//
//			function NoConstructor() {}
//
//			delete NoConstructor.constructor;
//			var Anon = function() {};
//			var object = wrap(ensure.object);
//
//			assert.noException(object(new Example1()));
//			assert.noException(object(new Example1(), Example1));
//
//			assert.exception(object(null, Example1), /variable expected object, but was null/);
//			assert.exception(object(new Example1(), Example2), /Expected variable to be (Example2 instance|a specific
// type)(, but was Example1)?/); assert.exception(object(new Anon(), Example2), /Expected variable to be (Example2
// instance|a specific type)/); assert.exception(object(new NoConstructor(), Example2), /Expected variable to be
// (Example2 instance|a specific type)/); assert.exception(object(new Example1(), Example2, "name"), /Expected name to
// be (Example2 instance|a specific type)/);  if (Object.create) {    // don't run this test on IE 8
// assert.exception(object(Object.create(null), Example2), /Expected variable to be (Example2 instance|a specific
// type), but it has no prototype/); } });  });  function wrap(fn) { return function() { var outerArgs = arguments;
// return function() { fn.apply(this, outerArgs); }; }; }  });

}());