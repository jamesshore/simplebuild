Simplebuild - Another way of thinking about build automation
====================

Design Goals
-------

*Simple.* Simple to use, simple to create, and simple to extend.

*Replaceable.* No framework lock-in. You can use Simplebuild modules with any tool, and you can easily replace Simplebuild modules with something else.

*Flexible.* Works with multiple styles of automation (Grunt, Jake, Node callbacks, promises, etc.) and allows you to compose modules to achieve interesting results.


Modules Specification
-------

Simplebuild modules are normal Node.js modules whose exported functions follow a common format. A Simplebuild module SHOULD have a name starting with "simplebuild-" but not "simplebuild-ext-". (For example, "simplebuild-yourmodule.js".)

Simplebuild modules MAY export any number of functions. Each exported function may use any name, except that they MUST NOT be named "sync()" or use a name ending in "Sync()" (case-sensitive). Each exported function MUST have this signature:

    exports.yourFunction = function(options, success, failure) { ... }
    exports.yourFunction.title = "Your Name";
    exports.yourFunction.description = "Your description of the module."

`options` (REQUIRED): Configuration information. Any type of variable may be used, but an object is recommended. Each exported function MAY use this variable to determine what to do.

`success()` (REQUIRED): Callback function. Each exported function MUST call success() with no parameters when it finishes successfully.

`failure(messageString)` (REQUIRED): Callback function. Each exported function MUST call failure() with a human-readable explanation when it fails.

`title` (REQUIRED): A human-readable name for the function. It SHOULD be written in title case.

`description` (REQUIRED): A human-readable description of the function. It SHOULD be written as a single sentence, starting with a capital letter and ending with a period.

Note: Either success() OR failure() MUST be called exactly once each time an exported function is called. It MAY be called synchronously or asynchronously.

Note 2: Exported functions MUST NOT return values or throw exceptions. (Call failure() instead of throwing an exception.)


Extension Specification
--------------

Simplebuild extension modules extend the capabilities of Simplebuild. A Simplebuild extension module SHOULD have a name starting with "simplebuild-ext-" (for example, "simplebuild-ext-yourextension.js").

Simplebuild extensions MAY export any number of functions with any signature. Exported functions MAY do anything, including composing other Simplebuild modules.


To Do
-----

Provide utility method for writing extension that composes modules