// Generated on 2013-10-15 using generator-angular 0.3.0
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
//var gsWhitelabel = require("./backend/gsWhitelabel");

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

/*
    var grunticonConfig = {
        dist: 'grunticon-dist',
        colors: {},
        classnamePrefix: 'whitelabel-'
    }
*/


/*

//whitelabel json example:
// {
// "colors": {
// "redlabel": "#ff5555"
// },
// "classnamePrefix": "whitelabel-",
// "colorSuffix": "-redlabel"
// }

    try {
        var whitelabelJson = gsWhitelabel.read();
        grunt.log.writeln('read whitelabel.json: ', whitelabelJson);
        grunticonConfig.colors = whitelabelJson.colors || grunticonConfig.colors;
        grunticonConfig.classnamePrefix = whitelabelJson.classnamePrefix || grunticonConfig.classnamePrefix;
    } catch (e) {
        grunt.log.writeln('failed to extract json config for white labeling: ', e);
    }
*/

    grunt.initConfig({
        yeoman: yeomanConfig,
//        gicon: grunticonConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            proxies: [
                {
                    context: '/backend',
                    host: 'localhost',
                    port: 9001,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            proxySnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
//                            '<%= gicon.dist %>',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        coffee: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/scripts',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/scripts',
                        ext: '.js'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/spec',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
         dist: {}
         },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            // dist: {
            //   files: {
            //     '<%= yeoman.dist %>/styles/main.css': [
            //       '.tmp/styles/{,*/}*.css',
            //       '<%= yeoman.app %>/styles/{,*/}*.css'
            //     ]
            //   }
            // }
            options:{processImport: false}
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
//            whitelabel: {
//                files: [
//                    // grunticon generated stylesheets
//                    // TODO we should probably also copy these stylesheets to the dist folder
//                    {
//                        expand: true,
//                        cwd: '<%= gicon.dist %>',
//                        dest: '<%= yeoman.app %>/styles',
//                        src: [
//                            '**/*.css'
//                        ],
//                        // change the file extension, and prefix with an underscore to stick to sass conventions
//                        // in order to comfortably import these files to the main sass stylesheet
//                        ext: '.scss',
//                        rename:  function (dest, src) {
//                            return dest + '/_' + src;
//                        }
//                    }
//                ]
//            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'bower_components/**/*.{ttf,svg,gif,png}',
                            'images/{,*/}*.{gif,webp,svg}',
                            'styles/fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '.',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '.npmignore',
                            'package.json',
                            'server.js',
                            'backend/**/*',
                            'cosmoui.js',
                            'cosmoui.1',
                            'logs/gsui.log'

                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }
                ]
            }
        },
        concurrent: {
            server: [
                'coffee:dist',
                'compass:server'
            ],
            test: [
                'coffee',
                'compass'
            ],
            dist: [
                'coffee',
                'compass:dist',
                'imagemin',
                'htmlmin'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/scripts',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>/scripts'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
//        },
//        grunticon: {
//            whitelabel: {
//                files: [{
//                    expand: true,
//                    cwd: '<%= yeoman.app %>/images/svg',
//                    src: ['*.svg'],
//                    dest: '<%= gicon.dist %>'
//                }],
//                options: {
//
//                    // SVGO compression, false is the default, true will make it so
//                    svgo: true,
//
//                    // CSS filenames: we don't want to change the file extension just yet, as these files can be
//                    // statically imported to preview the icons, just change the file name to our benefit
//                    datasvgcss: 'whitelabelImagesSvg.css',
//                    datapngcss: 'whitelabelImagesPng.css',
//                    urlpngcss: 'whitelabelImagesFallback.css',
//
//                    // prefix for CSS classnames: avoid the default '.icon-' prefix to prevent collisions with bootstrap styles
//                    cssprefix: '.<%= gicon.classnamePrefix %>',
//
//                    // NOTE: the colors option is broken at the moment, see this issue: https://github.com/filamentgroup/grunticon/issues/113
//                    // define vars that can be used in filenames if desirable, like foo.colors-redlabel.svg
//                    colors: '<%= gicon.colors %>'
//                }
//            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'configureProxies',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'connect:test',
        'karma'
    ]);

/*
    grunt.registerTask('whitelabel', [
            'grunticon',
            'copy:whitelabel'
        ]);
*/

    grunt.registerTask('build', function () {

        var tasks = [
            'clean:dist',
            'useminPrepare',
            'concurrent:dist',
            'concat',
            'copy:dist',
            'ngmin',
            'cssmin',
            'uglify',
            'rev',
            'usemin'
        ];

/*
        if (target === 'wl') { // whitelabel
            tasks.splice(tasks.indexOf('copy:dist'), 0, 'whitelabel'); // insert grunticon task before copy task
        }
*/

//        grunt.log.writeln(tasks);
        grunt.task.run(tasks);
    });

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
