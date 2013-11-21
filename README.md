Simplebuild - Another way of thinking about build automation
====================

Design Goals
-------

*Simple.* Simple to use, simple to create, and simple to extend.

*Replaceable.* No framework lock-in. You can use Simplebuild modules with any tool, and you can easily replace Simplebuild modules with something else.

*Flexible.* Works with multiple styles of automation (Grunt, Jake, Node callbacks, promises, etc.) and allows you to compose modules to achieve interesting results.


Modules Specification
-------

MUST be named "simplebuild-your_name.js"

Simplebuild modules are normal Node.js modules whose exported functions follow a common format. Every exported function MUST have this signature:

    exports.yourFunction = function(options, success, failure) { ... }

`options` (REQUIRED): Configuration information. Any type of variable may be used, but an object is recommended.

`success()` (REQUIRED): Callback function. Each exported function MUST call success() with no parameters when it finishes successfully.

`failure(messageString)` (REQUIRED): Callback function. Each exported function MUST call failure() with a human-readable explanation when it fails.

Note: Either success() OR failure() MUST be called exactly once each time exported function is called.

A Simplebuild module may export any number of functions. Functions MUST NOT be named "sync()" or use a name ending in "Sync()" (case-sensitive), but other than that restriction, any name may be used.

