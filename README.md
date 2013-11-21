Simplebuild - Another way of thinking about build automation
====================

Design Goals
-------

*Simple.* Simple to use, simple to create, and simple to extend.

*Replaceable.* No framework lock-in. You can use Simplebuild modules with any tool, and you can easily replace Simplebuild modules with something else.

*Flexible.* Works with multiple styles of automation (Grunt, Jake, Node callbacks, promises, etc.) and allows you to compose modules to achieve interesting results.


Modules Specification
-------

Simplebuild modules are normal Node.js modules whose exported functions follow a common format. A Simplebuild module MUST have a name starting with "simplebuild-" (for example, "simplebuild-your_module.js"). It MAY export any number of functions.

Simplebuild exports may use any name, except that they MUST NOT be named "sync()" or use a name ending in "Sync()" (case-sensitive). Each exported function MUST have this signature:

    exports.yourFunction = function(options, success, failure) { ... }

`options` (REQUIRED): Configuration information. Any type of variable may be used, but an object is recommended. Each exported function MAY use this variable to determine what to do.

`success()` (REQUIRED): Callback function. Each exported function MUST call success() with no parameters when it finishes successfully.

`failure(messageString)` (REQUIRED): Callback function. Each exported function MUST call failure() with a human-readable explanation when it fails.

Note: Either success() OR failure() MUST be called exactly once each time an exported function is called. It MAY be called synchronously or asynchronously.


Module Extension Specification
--------------

A Simplebuild extension module

MUST be named "simplebuild-ext-your_name.js"

MAY export any functions desired, or simply be a function.

Exported functions MAY compose other Simplebuild modules.

