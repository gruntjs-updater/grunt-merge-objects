# grunt-merge-objects

> Merges two files each with a hierarchical JS key/value object structure. The plugin is specially adapted to object literals specified through AMD define({}). First file is the base object, and subsequent files overrides and extends the base. 

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-merge-objects --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-merge-objects');
```

## The "merge_objects" task

### Overview
In your project's Gruntfile, add a section named `merge_objects` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  merge_objects: {
    options: {
      // functionName: 'define' // Only option and its default value.
    },
    files: {
      // List of files that should be merged, in the order of precedence. Later files override properties in earlier files.
    },
  },
});
```

### Options

#### options.functionName
Type: `String`
Default value: `'define'`

The name of the function wrapping the key/value object literal.

### Usage Examples

Properties found in either `base.js` and `extension.js` will be copied to a new object literal found in `tmp/merged.js`, also on sub-property levels.
If a property exists in both source files, the value in `extension.js` will be used.

```js
grunt.initConfig({
    merge_objects: {
      default_options: {
        options: {
        },
        files: {
          'tmp/merged.js': ['test/fixtures/base.js', 'test/fixtures/extension.js']
        }
      }
    }
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
Was it ever released?
