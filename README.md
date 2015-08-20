Simplebuild - Universal Task Automation for Node.js
====================

Tools like [Grunt](http://www.gruntjs.com) have powerful and flexible plugin ecosystems, but they only work within their walled garden. If you want to use Grunt plugins in [Jake](https://github.com/mde/jake), Jake tasks in Grunt, or write your own tool using an existing plugin... you're out of luck.

What if we had a universal approach to task automation? What if our task libraries worked with *any* tool, but our code was still idiomatic, flexible, and powerful? Imagine how useful that would be.

Simplebuild provides the solution. It's a standard way of *creating* and *plugging together* tasks that works with any tool. It's simple, but powerful; flexible, but idiomatic.

Note: Simplebuild is still in the proof-of-concept stage. Feedback welcome (be kind). Simplebuild is changing rapidly and shouldn't be used for production work yet.


Design Goals
-------

*Simple.* Simple to use, simple to create, and simple to extend.

*Replaceable.* No framework lock-in. You can use Simplebuild modules with any tool, and you can easily replace Simplebuild modules with something else.

*Flexible.* Works with multiple styles of automation (Grunt, Jake, promises, etc.) and allows you to compose modules to achieve interesting results.


Examples
-------

The following examples use Simplebuild modules to lint and test some code. Note how Simplebuild adapts to provide clean, idiomatic solutions for each tool.

(Note: these examples are slightly simplified. See [Gruntfile.js](Gruntfile.js), [Jakefile.js](Jakefile.js), or [build.js](build.js) for real code.)

### Grunt

```javascript
module.exports = function(grunt) {
  var simplebuild = require("simplebuild-ext-gruntify.js")(grunt);

  grunt.initConfig({
    JSHint: {
      files: [ "**/*.js", "!node_modules/**/*" ],
      options: { node: true },
      globals: {}
    },

    Mocha: {
      files: [ "**/_*_test.js", "!node_modules/**/*" ]
    }
  });

  simplebuild.loadNpmTasks("simplebuild-jshint");
  simplebuild.loadNpmTasks("simplebuild-mocha");

  grunt.registerTask("default", "Lint and test", ["JSHint", "Mocha"]);
};
```

### Jake

```javascript
var jakeify = require("simplebuild-ext-jakeify.js").map;

var jshint = jakeify("simplebuild-jshint.js");
var mocha = jakeify("simplebuild-mocha.js");

task("default", ["lint", "test"]);

desc("Lint everything");
jshint.validate.task("lint", {
  files: [ "**/*.js", "!node_modules/**/*" ],
  options: { node: true },
  globals: {}
});

desc("Test everything");
mocha.runTests.task("test", [], {
  files: [ "**/_*_test.js", "!node_modules/**/*" ]
});
```

### Promises

```javascript
var promisify = require("simplebuild-ext-promisify.js").map;

var jshint = promisify("simplebuild-jshint.js");
var mocha = promisify("simplebuild-mocha.js");

jshint.validate({
  files: [ "**/*.js", "!node_modules/**/*" ],
  options: { node: true },
  globals: {}
})
.then(function() {
  return mocha.runTests({
    files: [ "**/_*_test.js", "!node_modules/**/*" ]
  });
})
.then(function() {
  console.log("\n\nOK");
})
.fail(function(message) {
  console.log("\n\nFAILED: " + message);
});
```

### Running the examples

Before running the examples:

1. Install Node.js
2. Download the project code
3. Open a command prompt in the project's root directory
4. Run `npm install` to install dependencies

To run the examples:

1. Run `node build.js`, `./grunt.sh`, or `./jake.sh`. (Windows users, use `node build.js`, `node_modules\.bin\grunt`, or `node_modules\.bin\jake`.)


Composability
-------

Simplebuild tasks can be used in any Node.js program, so it's easy to create tasks that depend on other tasks. If there's a module that does just what you need, no worries--just `require()` it and use it!

Simplebuild also supports "mapper modules" that change the way tasks run, and "extension modules" that interface with other tools. For example, the `simplebuild-map-header` module adds a header to tasks, and the `simplebuild-ext-promisify` module converts tasks into promises. Modules can be chained together, providing flexibility and power, without requiring any special programming in the tasks.

In this example, a single addition (the second line) to the "Promises" example above adds a header to all tasks:

```javascript
var promisify = require("simplebuild-ext-promisify.js")
  .map("simplebuild-map-header.js")
  .map;

var jshint = promisify("simplebuild-jshint");
var mocha = promsifiy("simplebuild-mocha");
...
```

Output:

```
Before:                         After:

Gruntfile.js ok                 JSHint
Jakefile.js ok                  ======
build.js ok                     Gruntfile.js ok
    ⋮                           Jakefile.js ok
								build.js ok
  ․․․․․․․․․․․․․․․․․․․               ⋮

  19 passing (44ms)             Mocha
                                =====

OK                                ․․․․․․․․․․․․․․․․․․․

                                  19 passing (44ms)


                                OK
```


How It Works
-------

Simplebuild's magic is based on standardized, composable function signatures and a very small supporting library. There are three kinds of Simplebuild modules:

* *Task modules* do the heavy lifting of task automation. For example, the `simplebuild-jshint` module uses JSHint to check files for errors. Task modules export functions that follow a standard format: `exports.taskFunction = function(options, successCallback, failureCallback) {...}`. This is the only requirement for Simplebuild tasks, other than some recommended documentation, so they're very easy to create.

* *Mapper modules* take a task module as input and provide a task module as output. (They can also convert other mapper modules, which allows them to be chained together.) They're programmed to provide a generally-useful improvement to task modules. For example, the `simplebuild-map-header` module adds a header to each task. The `createMapFunction()` call in the simplebuild library makes mapper modules easy to create.

* *Extension modules* are like mapper modules, except that they don't have any restrictions on their input or output. They're most often used for compatibility with other coding styles. For example, `simplebuild-ext-promsify` turns Simplebuild tasks into promises, and `simplebuild-ext-gruntify` loads Simplebuild modules into Grunt.


Creating Modules
------

For now, the easiest way to create a Simplebuild module is to copy one of the existing examples:

* Examples of task modules are in the [tasks/](tasks/) directory.

* Examples of mapper modules are in the [mappers/](mappers/) directory.

* Examples of extension modules are in the [stuff/](extensions/) directory. ...Nah, I'm just shitting you. They're in the [extensions/](extensions/) directory.

Eventually, the example modules will be released as standalone npm modules, but that's still in the future.


Contributions
-------

Contributions, feedback, and discussions are welcome. Please use Github's issue tracker to open issues or pull requests.

**Known issues**: This is still very experimental, proof-of-concept stuff. The core `simplebuild` library is likely to see a lot of changes, the spec is likely to change and improve, and there aren't any tests yet.


Formal Specification
-------
**[Stability](http://nodejs.org/api/documentation.html#documentation_stability_index): 1 - Experimental**

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this section are to be interpreted as described in [RFC 2119](http://tools.ietf.org/html/rfc2119).

### Task Modules

Task modules export functions that follow a common format. A task module SHOULD have a name starting with "simplebuild-" but not "simplebuild-map-" or "simplebuild-ext-". (For example, "simplebuild-yourmodule.js".) All functions exported by a task module MUST be task functions.

Task functions MUST NOT be named `map()`, `sync()`, or use a name ending in `Sync()`. (These restrictions are case-sensitive.) Any other name is permitted. Each task function MUST conform to this signature:

    exports.yourFunction = function(options, success, failure) { ... }

`options` (REQUIRED): Configuration information. Any type of variable may be used, but an object is recommended. Each exported function MAY use this variable to determine what to do.

`success()` (REQUIRED): Callback function. Each exported function MUST call success() with no parameters when it finishes successfully.

`failure(messageString)` (REQUIRED): Callback function. Each exported function MUST call failure() with a brief human-readable explanation when it fails. The explanation SHOULD be less than 50 characters.


#### Task Behavior

Task functions MUST NOT return values or throw exceptions. Instead, either the `success()` or `failure()` callback MUST be called exactly once when the task is complete. The callback MAY be called synchronously or asynchronously.

Tasks that fail SHOULD provide a detailed explanation suitable for debugging the problem. If the explanation is too long to fit in the 50-character failure mesage, the task SHOULD write the details to `process.stdout` before failing. (Note that calling `console.log()` is a convenient way of writing to `process.stdout`.)

Tasks that succeed SHOULD NOT write to `process.stdout` by default. They MAY write more if configured to do so with the `options` parameter.

Tasks that are slow or long-running MAY provide minimalistic progress output (such as periods) but SHOULD NOT provide more detailed information by default. They MAY write more if configured to do so with the `options` parameter.

Tasks SHOULD NOT write to `process.stderr` under any circumstances.


#### Task Descriptors

Each task function SHOULD also a `descriptors` object attached, as follows:

    exports.yourFunction.descriptors = {
        title: "The Task Name",
        description: "A detailed description of the task function. Markdown may be used.",
        options: { ... }  // see below
    };

`title`: A human-readable name for the function. It SHOULD be written in title case. It SHOULD be less than 22 characters. It MUST NOT be written in Markdown or any other markup language.

`description`: A detailed, human-readable description of the function. The first sentence SHOULD be less than 50 characters and provide a summary description of the function. The rest of the description may be of any length and SHOULD completely describe the function. It MUST be written in Github-flavored Markdown.

`options`: An object describing the possible values for the task's `options` parameter. Every property that is permitted in the `options` parameter should have a corresponding property in this descriptor. The key MUST be identical to the key used in the actual options parameter, and the value MUST be an object, as follows:

    exports.yourFunction.descriptors.options.<key> = {
        description: "A detailed description of the option. Markdown may be used."
        // Note: future versions of this specification are likely to add additional option descriptors.
    };

`options.<key>.description`: A detailed, human-readable description of the option. The first sentence SHOULD be less than 50 characters and provide a summary description of the option. The rest of the description may be of any length and SHOULD completely describe the option. It MUST be written in Github-flavored Markdown.


### Mapper Modules

Mapper modules export a single function, `map()`, that transforms a Simplebuild module in some way. A mapper module SHOULD have a name starting with `simplebuild-map-`. (For example, `simplebuild-map-yourmapper.js`.)

Mapper modules SHOULD use the `createMapFunction()` API call, defined in the `simplebuild` module, to create the `map()` function. Mapper modules MUST export only one function, named `map()`. The `map()` function call itself SHOULD NOT have any side effects, but the functions `map()` returns MAY have side effects.

The `map()` function MUST take a single parameter and return an object, as follows. These requirements are handled automatically by `createMapFunction()`.

* When the parameter is an object with a single key named `map`, it will be considered to be a mapper module. In this case, the `map()` function MUST return a mapper module. The returned module's `map()` function MUST wrap the provided mapper module so that calling `thisModule.map(providedModule).map(taskModule)` is equivalent to calling `thisModule.map(providedModule.map(taskModule))`

* When the parameter is any other object, it will be considered to be a task module. In this case, the `map()` function MUST return a task module object. The returned task module SHOULD have different functions and/or behavior than the provided task module.

* When the parameter is a string, it will be considered to be an npm module. In this case, the `map()` function MUST use the Node.js `require()` API call to load the module, then apply the above rules.


### Extension Modules

Extension modules extend the capabilities of Simplebuild. An extension module SHOULD have a name starting with "simplebuild-ext-" (for example, "simplebuild-ext-yourextension.js").

Extension modules MAY export any number of functions with any signature. Exported functions MAY do anything, including accepting other Simplebuild modules as parameters. When a function supports loading task modules by name, it SHOULD also support mapper modules as well. The `createMapFunction` API call defined in the `simplebuild` module may be helpful here.


To Do
-----
Current project:
- Implement simplebuild-mocha and use it to drive improvements to simplebuild core

Where I left off:
- Factored stdout/stderr testing into test-console

What's next:
- Factor `__test_files` into its own module?

Change before release:
- Modify examples to use new descriptor spec

Things that still need work:
- When creating a module, the options and parameters need a lot of checking in `index.js`. Writing tests for this behavior is particularly tedious and repetitive. Create helper methods for this that take advantage of descriptors.
- Should messages be written to stderr instead of stdout? Or perhaps some sort of 'reporter' spec
- Pull `__test_files.js` out of simplebuild-jshint into its own module or helper
- Pull `expectSuccess()` and `expectFailure()` out of simplebuild-jshint (_index_test.js)

Version History
---------------
* 0.3.0: Reworked descriptors
* 0.2.0: Fleshed out spec further, made library work as proper npm module
* 0.1.0: Initial release

Credits
-------
Simplebuild is a project of [Let's Code: Test-Driven JavaScript](http://www.letscodejavascript.com), a screencast on professional, rigorous JavaScript development. Created by James Shore.


License
-------
The MIT License (MIT)

Copyright (c) 2013-2015 James Shore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

