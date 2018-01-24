Mario5 TS
=========

This repository contains the code for the TypeScript version of the Mario5 demo application.

* This repository was forked from [https://github.com/FlorianRappl/Mario5TS] and adapted to:
    * Use TypeScript 2.0+.
    * Be buildable inside IDEs.
    * Not depend on `gulp` (e.g., be buildable with `tsc` alone).
    * Be testable with automated unit tests.
* The original JavaScript code is available in `reference/`.
* The description below hints, where features of TypeScript have been placed.
* An article describing the original code is available on [CodeProject](http://www.codeproject.com/Articles/396959/Mario).

Practice
-------------------

This repository has been provided to learners in the edX course Software Engineering: Introduction as a running example
throughout the course. You are encouraged to clone or download this repository and work along with the lecture videos
when applicable. This repository can also be used as a way to practice various concepts throughout the course on an
existing TypeScript code base. Since the code is presented 'as-is', there are many opportunities for improvement
and refactoring. All you need in order to get started is access to the command line on your machine, and a simple text
editor or IDE compatible with TypeScript (such as WebStorm or Visual Studio Code).


Requirements
------------

For compiling the code you will need the following applications:

* npm (tested with v5.0.3) for installation
* webpack (tested with 3.10.0)

You can download Node.js (which includes npm) here: https://nodejs.org/en/download/

You can find instructions to download webpack using npm here: https://www.npmjs.com/package/webpack

Windows users may need to change the package.json file configure line within the project before following the rest of the installation instructions:
	
	'"configure": "mkdir release & xcopy /s assets release",'


Installation
------------

First you should clone the repository. Then in the directory of the repository run:

    `npm install`


To build the application, run:

    `npm run configure`


And then:

    `webpack`


If the webpack command is not found, try running this instead (Windows users may need to enclose the following command in double quotations):

	'node_modules/.bin/webpack'


This will compile everything and copy resources a subfolder called `release`. If you want to play the game from this version you can:

    `npm run serve`

During development, you can build the application with either of the two following commands:

    `npm run build`
    `tsc`

Either of these commands will cause the browser-version to refresh, if you have run the `serve` command above.

If your project folders aren't displaying normally, try running this command and then close and re-open your project in your IDE:

    'rm -r .idea'

This allows the workspace files for your project to regenerate and should fix any display issues.

The following parts of this README were forked from FlorianRappl's original repository.

TypeScript Features
-------------------

This section contains a list of features that have been used in the transformation process. Each feature usage is shortly described, and decorated with a concrete example comparing old (vanilla JS) code to new (TS annotated) code.

### Type annotations

Type annotations are the core concept of TypeScript. There is no equivalent in JavaScript, and even though some people propose type annotations to ES for a while, it will probably never be part of the standard. That being said: TypeScript uses a compile-time type system. Every annotation will disappear during the compilation process and won't be present in the final JavaScript output.

Therefore there is no comparison. However, there are some important hints. First example:

	var basepath  = 'Content/';

There is nothing to do. The variable `basepath` is already infered to be of type `string`. Nevertheless, sometimes it makes sense.

	var definedLevels: LevelFormat[] = /* ... */;

The type `LevelFormat` is an interface. This brings us to the next feature.

### Interfaces

Interfaces describe how objects should look like. They are quite close to interfaces in C#, Java and similar languages, however, they do not represent a runtime type and cannot be used for real type detection with an `instanceof` operator. Again, this is a TypeScript only feature and necessary due to TypeScript's desire to specify as much as possible.

The interface for the `LevelFormat` looks as follows:

	interface LevelFormat {
		width: number;
		height: number;
		id: number;
		background: number;
		data: string[][];
	}

Interfaces can also be extended in TypeScript. This is really useful, since in ES no instantiated object is every finished. No designed class is cut in stone. In case of Mario5 the `Math` object (let's call it a static class, just for comparison to C# or Java) is extended with the `sign` method. This is not allowed unless we extend the specification of the `Math` object's underlying interface definition:

	interface Math {
		sign(x: number): number;
	}

This merging makes it possible to allow, e.g., jQuery plugins, i.e. scripts that extend the original definition with further functionality.

### Classes

Here is where it gets more interesting. Previously I used some kind of custom "OOP" script to allow easier definition of "class"-like objects and inheritance. However, TypeScript has everything I need included.

The original code was:

	var Gauge = Base.extend({
		init: function(id, startImgX, startImgY, fps, frames, rewind) {
			this._super(0, 0);
			this.view = $('#' + id);
			this.setSize(this.view.width(), this.view.height());
			this.setImage(this.view.css('background-image'), startImgX, startImgY);
			this.setupFrames(fps, frames, rewind);
		},
	});

In the new version that becomes:

	class Gauge extends Base {
		constructor(id: string, startImgX: number, startImgY: number, fps: number, frames: number, rewind: boolean) {
			super(0, 0);
			this.view = $('#' + id);
			this.setSize(this.view.width(), this.view.height());
			this.setImage(this.view.css('background-image'), startImgX, startImgY);
			this.setupFrames(fps, frames, rewind);
		}
	};

I already use annotations to limit the usage of the constructor. In the end that is really useful for preventing bugs. A really tricky bug might be to forget that the `this` pointer is a contextual pointer, not an instance/object pointer. However, this is solved by the fat-arrow operator.

### Fat-Arrow operator

The Fat-Arrow operator is another ES6 feature that made it into TypeScript. The syntax should be familiar to C# developers. It is also quite close to the one used in Java. Both languages name it a lambda expression. In TypeScript / ES6 this kind of function definition has also the advantage of preserving the current `this`.

Let's see an example in the old code:

	var Level = Base.extend({
		/* ... */
		start: function() {
			var me = this;
			me.loop = setInterval(function() {
				me.tick.apply(me);
			}, constants.interval);
		},
		/* ... */
	}

With TypeScript this can be even simplified. The new version is shorter, easier to read and does not require the explicit capturing. TypeScript is, however, of course solving the problem like we did before. Nevertheless, if one is not sure about what `this` might be, the fat-arrow function is definitely a robust solution.

	class Level extends Base {
		/* ... */
		start() {
			this.loop = setInterval(() => this.tick(), setup.interval);
		}
		/* ... */
	};

Another feature that makes TypeScript worth using is the modules system. It only plays well with AMD and CommonJS structured modules, but is independent of a concrete implementation.

### Modules

The basic currency in a TypeScript file is definitions. First, TypeScript checks for any syntax errors. If that validation is okay, then the infered types will be checked. Naturally we will also use types, that are not defined within that one file. TypeScript knows about this and implicitely uses the definitions of the JavaScript standard library. But what if we want to include, e.g., jQuery?

We can tell TypeScript that a specific file will have access to more globally available variables by including a reference to a file that defines the available functionality. The functionality may be defined through the original file (including the implementations), or a special kind of file called a *definition file*.

We achieve this by placing a special kind of comment at the top of a file:

	/// <reference path="def/interfaces.d.ts"/>

That way we can have a lot of independent files, which will be required to be placed / loaded by us in an optimal order. However, this has nothing to do with modules directly.

The path described earlier is great for web-development, but cannot be used with node. Here our only hope is to load modules using the CommonJS pattern. Therefore we need to define the external legs of a file. Everything else is internal only. These external legs form the exported parts of a module.

TypeScript distinguished between two kinds of modules: internal modules and external modules. While external ones bridge between files, internal modules alias within files.

The code has not been modularized before. Therefore there is no equivalent, however, there could have been. This is an improved design, that is decoupled from a specific module pattern (such as CommonJS or AMD) by TypeScript.

We use external modules. Declarations have been placed like the following:

	export = definedLevels;

Here the whole file exports just a single object. But this object is everything that is imported. See:

	import levels = require('./testlevels');

This is equivalent to the former notation (with a global `definedLevels`):

	var levels = definedLevels;

Difference: No polluation of the global namespace, less coupling. There are also other examples:

	export function run(levelData: LevelFormat, controls: Keys) {
		var level = new Level('world', controls);
		level.load(levelData);
		level.start();
	};

This can be found in the *main.ts*. We use it as follows:

	import game = require('./main');
	/* ... */

	$(document).ready(function() {
		game.run(levels[0], controls);
	});

Before we only had one document ready function that basically did both things. More coupled, less extension friendly.

What about internal modules? They are used as well!

	import constants = require('./constants');
	import Direction = constants.Direction;

Usually we would be required to rename all occurrences of `Direction` to `constants.Direction`. It is not possible to use

	var Direction = constants.Direction;

even though this brings in the correct value at runtime. The problem is, that TypeScript's metasystem will not accept dynamic variables as such types. Therefore we need to alias it correctly. This is done via the `import` statement. Nevertheless, here we use it on a module (`constants`). This is different to the first line, where we use it with `require`, which brings in an (external) module.

The great thing about this modular approach: We do not need to include the references as described above. They will be resolved automatically.
