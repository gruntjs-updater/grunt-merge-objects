/*
 * grunt-merge-objects
 * https://github.com/torerikal/grunt-merge-objects
 *
 * Copyright (c) 2015 Tor Erik Alræk.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    var vm = require('vm');

    //function isObject(o) {
    //    return (o != null && o.constructor === {}.constructor);
    //}

    function getType(elem) {
        return Object.prototype.toString.call(elem).slice(8, -1);
    }
    
    function isObject(o) {
        return getType(o) === 'Object';
    }

    function combine(base, extension, recursive) {
        var copy = {};
        if (base) {
            for (var prop in base) {
                if (base.hasOwnProperty(prop)) {
                    copy[prop] = base[prop];
                }
            }
        }
        if (extension) {
            for (var prop2 in extension) {
                if (extension.hasOwnProperty(prop2)) {
                    if (recursive && isObject(base[prop2]) && isObject(extension[prop2])) {
                        copy[prop2] = combine(base[prop2], extension[prop2], recursive);
                    } else {
                        //grunt.log.warn('Is not object: ' + getType(base[prop2]));
                        copy[prop2] = extension[prop2];
                    }
                }
            }
        }
        return copy;
    }
    
    grunt.registerMultiTask('merge_objects', 'Merges two files each with a JS multi-level key/value structure. Latter one overrides and extends the first ne.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            functionName: 'define',
            startWrap: '(',
            endWrap: ');'
        });

        
        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Concat specified files.
            var contents = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                var defined, content = grunt.file.read(filepath);
                var sandbox = {};
                sandbox[options.functionName] = function (obj) {
                    defined = obj;
                };
                var script = new vm.Script(content);
                script.runInNewContext(sandbox);
                return defined;
            });

            var result = contents.reduce(function(base, ext) {
                return combine(base, ext, true);
            });

            // Write the destination file.
            var prettyResult = JSON.stringify(result, null, 2).replace(/(")([A-Za-z0-9_]*)(")\:/g,'$2:').replace(/([^\\"])(")/g, "$1'");
            
            grunt.file.write(f.dest, options.functionName + options.startWrap + prettyResult + options.endWrap);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
