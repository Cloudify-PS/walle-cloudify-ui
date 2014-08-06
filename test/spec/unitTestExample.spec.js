'use strict';

describe('Tested component name', function () {

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp', 'ngMock');

            // initialize a new instance of the filter
            inject(function (/* Inject the component */) {

            });
        });
    });

    describe('Unit tests', function() {
        it('should do something', function() {
            expect(/* Something that was tested */).toBe(/* Test result expectation */);
        });
    });
});
