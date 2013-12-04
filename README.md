Simplebuild - Another way of thinking about build automation
====================

Design Goals
-------

*Simple.* Simple to use, simple to create, and simple to extend.

*Replaceable.* No framework lock-in. You can use Simplebuild modules with any tool, and you can easily replace Simplebuild modules with something else.

*Flexible.* Works with multiple styles of automation (Grunt, Jake, Node callbacks, promises, etc.) and allows you to compose modules to achieve interesting results.


Specification
-------

There are three types of Simplebuild modules:

* *Task Modules*. Task modules do the heavy lifting of task automation. For example, the `simplebuild-jshint` module uses JSHint to check files for errors.

* *Mapper Modules*. Mapper modules modify task modules in some way. They have a `map()` function that takes a module as input and provide a different version of that module as output. For example, the `simplebuild-ext-header` module modifies task modules to print out a header whenever a task runs. Mapper modules can be chained together to achieve multiple effects.

* *Extension Modules*. Extension modules might do anything. They typically provide ways of integrating task modules with other approaches. For example, the `simplebuild-ext-promisify` module turns tasks into promises, and the `simplebuild-ext-gruntify` module provides convenience functions for using tasks in Grunt.


Task Modules
-------

Task modules export functions that follow a common format. A task module SHOULD have a name starting with "simplebuild-" but not "simplebuild-ext-". (For example, "simplebuild-yourmodule.js".) Task modules MUST export one or more task functions.

Task functions MUST NOT be named `map()`, `sync()`, or use a name ending in `Sync()`. These restrictions are case-sensitive. Any other name is permitted. Each task function MUST conform to this signature:

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


Mapper Modules
------

Mapper modules export a single function, `map()`, that transforms a Simplebuild module in some way. A mapper module SHOULD have a name starting with `simplebuild-map-`. (For example, `simplebuild-map-yourmapper.js`.)

Mapper modules SHOULD use the `createMapFunction()` API call, defined in the `simplebuild` module, to create the `map()` function. Mapper modules MUST NOT export any other functions other than `map()`. The transformation applied within the `map()` function SHOULD NOT have any side effects.

The `map()` function MUST take a single parameter and return an object, as follows. These requirements are handled automatically by `createMapFunction()`.

* When the parameter is an object with a single key named `map`, it will be considered to be a mapper module. In this case, the `map()` function MUST return a mapper module. The returned module's `map()` function MUST wrap the provided mapper module so that calling `thisModule.map(providedModule).map(taskModule)` is equivalent to calling `thisModule.map(providedModule.map(taskModule))`

* When the parameter is any other object, it will be considered to be a task module. In this case, the `map()` function MUST return a task module object. The returned task module SHOULD have different functions and/or behavior than the provided task module.

* When the parameter is a string, it will be considered to be an npm module. In this case, the `map()` function MUST use the Node.js `require()` API call to load the module, then apply the above rules.


Extension Modules
------

Extension modules extend the capabilities of Simplebuild. An extension module SHOULD have a name starting with "simplebuild-ext-" (for example, "simplebuild-ext-yourextension.js").

Extension modules MAY export any number of functions with any signature. Exported functions MAY do anything, including accepting other Simplebuild modules as parameters. When a function supports loading task modules by name, it SHOULD also support mapper modules as well. The `createMapFunction` API call defined in the `simplebuild` function may be helpful here.
