(function () {

    var project = {
        name: 'boombox.js'
    };

    module.exports = function (grunt) {

        // enviroment
        project.dir = grunt.file.findup('../' + project.name);
        grunt.log.ok('[environment] project name:', project.name);
        grunt.log.ok('[environment] project directory:', project.dir);

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            clean: {
                src: ['docs', 'report']
            },
            'http-server': {

                'dev': {

                    root: './',
                    port: 1109,
                    host: "0.0.0.0",
                    showDir : true,
                    autoIndex: true,
                    ext: "html",
                    runInBackground: false
                }

            },
            jshint: {
                src: ['boombox.js'],
                options: {
                    jshintrc: '.jshintrc',
                    jshintignore: ".jshintignore"
                }
            },
            mkdir: {
                docs: {
                    options: {
                        mode: 0755,
                        create: ['docs']
                    }
                }
            },
            jsdoc : {
                dist : {
                    src: ['boombox.js'],
                    options: {
                        lenient: true,
                        recurse: true,
                        private: true,
                        destination: 'docs',
                        configure: '.jsdoc3.json'
                    }
                }
            },
            uglify: {
                options: {
                    sourceMap: 'boombox.min.map',
                    preserveComments: 'some'
                },
                default: {
                    files: {
                        'boombox.min.js': ['boombox.js']
                    }
                }
            },
            plato: {
                default: {
                    files: {
                        'report': ['boombox.js']
                    }
                }
            }
        });

        // These plugins provide necessary tasks.
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        // task: foundation
        grunt.registerTask('server', [
            'http-server:dev'
        ]);

        // task: build
        grunt.registerTask('build', [
            'jshint',
            'uglify:default'
        ]);

        // task: docs
        grunt.registerTask('docs', [
            'mkdir:docs',
            'plato',
            'jsdoc'
        ]);

        // task: defulat
        grunt.registerTask('default', [
            'clean',
            'docs',
            'build'
        ]);


    };
})(this);
