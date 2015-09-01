module.exports = function(config) {


    reportsHome = 'coverage/';

    if ( process.REPORTS_HOME ){
        reportsHome = process.REPORTS_BASE + '/coverage/';
    }

    var configuration = {
        // base path, that will be used to resolve files and exclude
        basePath: '',

        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/phantomjs.shim.js',
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/ng-file-upload/angular-file-upload.js',
            'app/bower_components/angular-cookies/angular-cookies.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-sanitize/angular-sanitize.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-animate/angular-animate.js',
            'app/bower_components/ngstorage/ngStorage.js',
            'app/bower_components/angular-timer/dist/angular-timer.js',
            'app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
            'app/bower_components/elastic.js/dist/elastic-angular-client.js',
            'app/bower_components/gs-ui-infra/app/templates/all.js',
            'app/bower_components/gs-ui-infra/app/scripts/**/*.js',
            'app/bower_components/d3/d3.js',
            'app/bower_components/elastic.js/dist/elastic.js',
            'app/bower_components/elastic.js/dist/elastic-angular-client.js',
            'app/bower_components/lodash/lodash.js',
            'app/bower_components/jquery-simulate/jquery.simulate.js',
            'app/bower_components/angular-translate/angular-translate.js',
            'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'app/bower_components/SyntaxHighlighter/scripts/XRegExp.js',
            'app/bower_components/SyntaxHighlighter/scripts/shCore.js',
            'app/bower_components/SyntaxHighlighter/scripts/shLegacy.js',
            'app/bower_components/SyntaxHighlighter/scripts/shAutoloader.js',
            'app/bower_components/SyntaxHighlighter/scripts/shBrushPython.js',
            'app/bower_components/SyntaxHighlighter/scripts/shBrushBash.js',
            'app/bower_components/SyntaxHighlighter/scripts/shBrushPlain.js',
            'app/bower_components/cloudify-js/dist/cloudify.angular.js',
            'app/styles/SyntaxHighlighter/shBrushYaml.js',

            'app/bower_components/ngDialog/js/ngDialog.min.js',
            'app/bower_components/ngprogress/build/ngProgress.js',
            'app/bower_components/angular-ticker/release/angular-ticker.js',
            'app/bower_components/angular-loading-bar/build/loading-bar.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/scripts/*.js',
            'app/scripts/**/*.js',
            '.tmp/styles/main.css',
            'test/spec/mocks/**/*.js',
            'test/spec/*.js',
            'test/spec/**/*.js',
            '.tmp/viewTemplates/templates.js'
        ],

        // list of files to exclude
        exclude: [],
        proxies: {
            '/images/': 'http://localhost:8080/base/app/images/',
            '/base/.tmp/bower_components/gs-ui-infra/' : 'http://localhost:8080/base/app/bower_components/gs-ui-infra/assets/fonts/'
        },
        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress'
        // CLI --reporters progress
        reporters: ['failed', 'junit', 'coverage'],

        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: 'test-results.xml',
            suite: ''
        },

        // web server port
        // CLI --port 9876
        port: 8080,

        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: ['PhantomJS'],

//        customLaunchers: {
//            Chrome_travis_ci: {
//                base: 'Chrome',
//                flags: ['--no-sandbox']
//            }
//        },

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: false,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,
        coverageReporter: {
            dir: reportsHome,
            subdir: function (browser) {
                var result = browser.toLowerCase().split(/[ /-]/)[0];
                console.log('this is browser', result);
                return result;
            },
            reporters: [  {type: 'html' },{ type: 'cobertura'} ]


        },

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-spec-reporter',
            'karma-failed-reporter',
            'karma-junit-reporter'
        ]
    };

//    if (process.env.TRAVIS) {
//        configuration.browsers = ['Chrome_travis_ci'];
//    }

    config.set(configuration);
};
