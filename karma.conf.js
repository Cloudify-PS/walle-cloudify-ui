// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/bower_components/jquery/jquery.min.js',
  'app/bower_components/angular/angular.js',
  'app/bower_components/angular-mocks/angular-mocks.js',
  'app/bower_components/ng-file-upload/angular-file-upload.js',
  'app/bower_components/angular-cookies/angular-cookies.js',
  'app/bower_components/angular-route/angular-route.js',
  'app/bower_components/angular-sanitize/angular-sanitize.js',
  'app/bower_components/angular-resource/angular-resource.js',
  'app/bower_components/angular-animate/angular-animate.js',
  'app/bower_components/ngstorage/ngStorage.js',
  'app/bower_components/angular-datepicker/dist/index.js',
  'app/bower_components/angular-timer/dist/angular-timer.js',
  'app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
  'app/bower_components/elastic.js/dist/elastic-angular-client.js',
  'app/bower_components/yamljs/bin/yaml.js',
  'app/bower_components/gs-ui-infra/app/scripts/**/*.js',
  'app/bower_components/i18next/i18next.js',
  'app/scripts/*.js',
  'app/scripts/**/*.js',
  'test/mock/**/*.js',
  'test/spec/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 15000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
