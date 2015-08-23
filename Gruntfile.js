// Generated on 2013-10-15 using generator-angular 0.3.0
'use strict';
// var logger = require('log4js').getLogger('Gruntfile');
var LIVERELOAD_PORT = 35729;
var lrSnippet = null;
var proxySnippet = null;
var path = require('path');
var mountFolder = function (connect, dir) {
    return connect.static(path.resolve(dir));
};

//var gsWhitelabel = require("./backend/gsWhitelabel");

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {


    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        distBlueprint: 'dist-blueprint',
        artifacts: 'artifacts'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        availabletasks: {
            help: {
                options: {
                    filter: 'include',
                    tasks: ['default', 'build','blueprint','buildArtifacts','uploadArtifacts','analyze']
                }
            }
        },
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/**/*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/**/*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}', 'app/bower_components/gs-ui-infra/**/*.scss'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
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
                            function(req, res, next) {
                                if(req.url.indexOf('/grafana') === 0) {
                                    req.url = req.url.substring('/grafana'.length) || '/';
                                    return connect.static(path.resolve('../grafana-cosmo/src/'))(req, res, next);
                                }
                                else {
                                    next();
                                }
                            },
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
                            proxySnippet,
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
                            '<%= yeoman.dist %>/*',
                            '<%= yeoman.distBlueprint %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp',
            coverageBackend: ['backend-coverage'],
            coverageFrontend: ['coverage'],
            instrumentBackend: ['backend-instrument']
        },
        jsdoc : {
            backend : {
                src: ['backend/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/**/*.js'
            ],
            backend:{
                options: {
                    jshintrc: 'backend/.jshintrc'
                },
                files: {
                    src: [
                        'backend/**/*.js'
                    ]
                }
            },
            backendMochaTest:{
                options: {
                    jshintrc: 'test/backend/unit/mocha/.jshintrc'
                },
                files: {
                    src: [
                        'test/backend/unit/mocha/**/*.js'
                    ]
                }
            },
            backendJasmineTest:{
                options: {
                    jshintrc: 'test/backend/.jshintrc'
                },
                files: {
                    src: [
                        'test/backend/**/*.js',
                        '!test/backend/unit/mocha/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    jshintrc: 'test/spec/.jshintrc'
                },
                files: {
                    'src': [
                        'test/spec/**/*.js',
                        '!test/jasmine*/**/*'
                    ]
                }
            }
        },
        coffee: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/scripts',
                        src: '**/*.coffee',
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
                        src: '**/*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        compress:{
            blueprint:{
                options: { archive: '<%=yeoman.dist%>/blueprint.tar.gz' },
                files: [
                    {
                        cwd: '<%=yeoman.distBlueprint%>/blueprint',
                        src: ['node-application/**'],
                        expand:true

                    }
                ]

            }

        },


// Compiles Sass to CSS and generates necessary files if requested
        sass: {

            dist: {
                files: {
                    '.tmp/styles/main.css' : '<%= yeoman.app %>/styles/main.scss'
                }
            },
            server: {
                files: {
                    '.tmp/styles/main.css' : '<%= yeoman.app %>/styles/main.scss'
                }

            }
        },
       /* compass: {
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
        },*/
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
         dist: {}
         },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
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
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
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
                        src: '**/*.{png,jpg,jpeg}',
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
            //       '.tmp/styles/**/*.css',
            //       '<%= yeoman.app %>/styles/**/*.css'
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
                        src: ['*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            artifacts:{
                files:[
                    {
                        expand:true,
                        dot: true,
                        cwd: '<%= yeoman.dist %>',
                        dest: '<%= yeoman.artifacts %>',
                        src: [ 'cosmo-ui-*.tgz', 'blueprint.tar.gz']
                    }
                ]
            },
            blueprint:{
                files:[
                    {
                        expand:true,
                        dot: true,
                        cwd: 'build',
                        dest: '<%= yeoman.distBlueprint %>',
                        src: [ 'blueprint/**']
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.dist %>',
                        dest: '<%= yeoman.distBlueprint%>',
                        src: [ 'cosmo-ui*.tgz'],
                        rename: function( dest /*, src*/ ){
                            return path.join(dest ,'blueprint/node-application','app.tgz');
                        }
                    }
                ]
            },
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
                            'bower_components/**/*.{ttf,woff,eot,svg,gif,png}',
                            'i18n/**/*.json',
                            'images/**/*.{gif,webp,svg}',
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
                            'LICENSE',
                            'VERSION',
                            'logs/*'

                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    },
                    {
                        expand: true,
                        flatten:true,
                        nonull:true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/bower_components/gs-ui-infra/assets',
                        dest: '<%= yeoman.dist %>/styles/fonts',
                        src: [
                            '**/*.{ttf,woff,eot,svg}'
                        ]
                    }
                ]
            },
            backendCoverageTests: {
                expand:true,
                dest: 'backend-instrument',
                src: ['test/**/*', 'backend/mock/**/*']
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
            },
            develop: {
                reporters: ['failed'],
                singleRun: true,
                configFile: 'karma.conf.js'
            },
            debug: {
                browsers: ['Chrome'],
                reporters: ['spec'],
                configFile: 'karma.conf.js',
                singleRun: false /** TODO : find how to : 1) tell karma to use chrome from here.. override conf file**/
                                                         /** 2) tell karma to run a single test from here... override conf file **/
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
        },
        /* using istanbul directly since jasmine-node-coverage plugin does not work properly yet...*/
       /* reference: https://github.com/taichi/grunt-istanbul */

        instrument: {
            files: 'backend/**/*.js',
            options: {
                lazy: true,
                basePath: 'backend-instrument/'
            }
        },
        storeCoverage: {
            options: {
                dir: 'backend-coverage/reports'
            }
        },
        makeReport: {
            src: 'backend-coverage/reports/**/*.json',
            options: {
                type: 'html',
                dir: 'backend-coverage/html/reports',
                print: 'detail'
            }
        },
        mochaTest: {
            unit: {
                options: {
                    reporter: 'xunit-file'
                },
                src: ['test/backend/unit/mocha/**/*js']
            },
            develop: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/backend/unit/mocha/**/*js']
            }

        },
        /*jshint camelcase: false */
        mocha_istanbul: {
            coverage: {
                'src' : 'test/backend/unit/mocha/**/*'
            }
        },
        shell: {
            npmPack: {
                command: 'npm pack',
                options: {
                    execOptions: {
                        cwd : '<%= yeoman.dist %>'
                    }
                }
            },
            npmInstallDist : {
                command: 'npm install --production',
                options: {
                    execOptions: {
                        cwd: '<%= yeoman.dist %>'
                    }
                }
            }
        },
        jasmine_node: {
            options: {
                jUnit: {
                    report: true,
                    savePath: 'backend_test_results/',
                    useDotNotation: true,
                    consolidate:true,
                    consolidateAll: true
                }
            },
            unit: ['test/backend/unit/jasmine/'],
            unitInstrument: ['backend-instrument/test/backend/unit/jasmine'],
            integration: ['test/backend/integration/jasmine/']
        },
        html2js: {
            options: {
                base: 'app'
            },
            main: {
                src: ['app/views/**/*.html'],
                dest: '.tmp/viewTemplates/templates.js'
            }
        },
        jscpd:{
            all: {
                path: '.',
                output: 'dev/jscpd.output.txt',
                exclude: [ 'app/bower_components/**', 'node_modules/**', 'dist/**','dev/**','app/styles/SyntaxHighlighter/**','test/jasmine-standalone-1.3.1/**'],
                threshold: 1
            }
        },
        'jscpdreporter': {
            options: {
                sourcefile: 'dev/jscpd.output.txt',
                outputDir: 'dev/jscpd-report/'
            }
        },
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.accessKey %>', // Use the variables
                secretAccessKey: '<%= aws.secretKey %>', // You can also use env variables
                region: '<%= aws.region %>',
                access: 'public-read',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            uploadArtifacts: {
                options: {
                    bucket: '<%= aws.bucket %>'
                },
                files: [
                    {dest: '<%= aws.folder %>', cwd: './artifacts' , expand:true, src:['**'],action: 'upload'}
                ]
            }
        }
    });


    grunt.registerTask('server', function (target) {

        proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

        if (target === 'dist') {
            return grunt.task.run([ 'configureProxies', 'open', 'connect:dist:keepalive']);
        }
        if (target === 'build_dist') {
            return grunt.task.run([ 'build', 'configureProxies', 'open', 'connect:dist:keepalive']);
        }
        // guy - moving lines here after build broke.
        // this way : 1) build will not break 2) it will be clearer what broke where

        lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'configureProxies',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('analyze', 'analyzes the sources and reports quality problems such as copy-paste', [ 'jscpd', 'grunt-jscpd-reporter']);

    grunt.registerTask('test', function(testBackend) {
        var tasks  = [];
        if ( testBackend === undefined || testBackend === '' || testBackend === 'all' || testBackend === 'frontend') { // default
            tasks = [
                'jshint',
                'clean:server',
                'concurrent:test',
                'connect:test',
                'html2js',
                'karma:unit'
            ];
        }

        if( testBackend === undefined || testBackend === '' || testBackend === 'all' || testBackend === 'backend') {
            // guy - we always use code coverage in grunt.. when debug from the IDE so no need for no instrumented mode in grunt.

            tasks = tasks.concat([ 'mocha_istanbul','mochaTest:unit']);
            tasks = tasks.concat( ['clean:coverageBackend','instrument', 'copy:backendCoverageTests', /*'jasmine_node:unitInstrument', 'storeCoverage',*/ 'makeReport','clean:instrumentBackend']);
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask('build', 'builds the project', function () {

        var tasks = [
            'clean:dist',
            'useminPrepare',
            'concurrent:dist',
            'concat',
            'copy:dist',
            'overrideBuildVersion',
            'bundle',
            'ngmin',
            'cssmin',
            'uglify',
            'rev',
            'usemin'
        ];

        grunt.task.run(tasks);
    });


    grunt.registerTask('pack', 'after `build` will run npm pack on dist folder',[
        'shell:npmInstallDist',
        'shell:npmPack'
    ]);

    grunt.registerTask('bundle', 'A task that bundles all dependencies.', function () {
        // "package" is a reserved word so it's abbreviated to "pkg"
        var pkg = grunt.file.readJSON('dist/package.json');
        // set the bundled dependencies to the keys of the dependencies property
        pkg.bundledDependencies = Object.keys(pkg.dependencies);
        // write back to package.json and indent with two spaces
        grunt.file.write('dist/package.json', JSON.stringify(pkg, undefined, '  '));
    });

    grunt.registerTask('overrideBuildVersion', function(){
        var done = this.async();
        var versionFilename = 'VERSION';
        var buildVersion = null;
        if (grunt.file.exists(versionFilename)) {
            var fs = require('fs');
            buildVersion = grunt.file.readJSON(versionFilename).version;
            grunt.log.ok('build version is ', buildVersion );
            var packageJson = grunt.file.readJSON('dist/package.json');
            packageJson.version = buildVersion;
            try {
                fs.writeFile('dist/package.json', JSON.stringify(packageJson,{},4), function (err) {
                    if ( !!err ){
                        grunt.log.error('writing file failed',err);
                        grunt.fail.fatal('writing version failed');
                    }
                    grunt.log.ok('version changed successfully');
                    done();
                });
            }catch(e){
                grunt.log.error('unable to write build version ',e);
                grunt.fail.fatal('unable to write build version ');
            }
            grunt.log.ok('build version : ' +  buildVersion);
        } else {
            grunt.log.ok( versionFilename + ' does not exist. skipping version manipulation');
        }
    });

    grunt.registerTask('backend', function() {
        grunt.config.set('jshint.options.jshintrc', 'backend/.jshintrc');
        grunt.task.run('jshint:backend');
    });

    /**
     * This task assumes we have a packed artifact
     * run it by running `npm pack blueprint`
     * or if you already ran `npm pack` just run `npm blueprint`
     */
    grunt.registerTask('blueprint', 'a task to run after npm pack in order to construct the blueprint',[
        'copy:blueprint',
        'compress:blueprint'
    ]);


    grunt.registerTask('uploadArtifacts', 'assumes `buildArtifacts` execution. uploads artifacts to amazon and tarzan',[
        'readS3Keys',
        'aws_s3:uploadArtifacts'
    ]);

    /**
     * will output all artifacts : cosmo-ui.tar.gz and blueprint.tgz to folder named artifacts
     */
    grunt.registerTask('buildArtifacts', 'runs build from scratch. outputs ui.tar.gz and blueprint.tar.gz to folder `artifacts`', [
        'default',
        'pack',
        'blueprint',
        'copy:artifacts'
    ]);

    grunt.registerTask('readS3Keys', function(){

        var s3KeysDefault = {
            "accessKey" : process.env.S3_ACCESS_KEY,
            "secretKey" : process.env.S3_SECRET_KEY,
            "bucket" :    process.env.S3_BUCKET,
            "folder" :    process.env.S3_FOLDER,
            "region" :    process.env.S3_REGION

    };


        var s3KeysFile = process.env.AWS_JSON || './dev/aws-keys.json';

        // if nothing is defined anywhere... lets fail the process
        if (_.compact(_.values(s3KeysDefault)).length === 0 && !grunt.file.exists(s3KeysFile) ){
            grunt.fail.fatal('expecting s3 configuration either with S3_(ACCESS_KEY, SECRET_KEY, BUCKET_FOLDER, REGION) environment variables or in file ' + s3KeysFile  + ' but configuration was empty');
        }

        var fileOverrides = {};
        if ( grunt.file.exists(s3KeysFile)) {
            grunt.log.ok('reading s3 keys from [' + s3KeysFile + ']');
            fileOverrides = grunt.file.readJSON(s3KeysFile); // Read the file
        }else if ( process.env.AWS_JSON){
            grunt.log.warn('AWS_JSON file declared but does not exist [' + process.env.AWS_JSON + ']' );
        }

        grunt.config.data.aws = _.merge({}, s3KeysDefault, fileOverrides);
    });

    grunt.registerTask('default', 'compiles the project' ,[
        'jshint',
        'jsdoc',
        'test:all',
        'build',
        'backend'
    ]);




    grunt.registerTask('compass', ['sass']);


    grunt.registerTask('help', ['availabletasks:help']);

};
