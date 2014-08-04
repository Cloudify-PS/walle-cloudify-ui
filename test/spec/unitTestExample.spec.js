'use strict';

describe('Tested component name', function () {

    // load the component's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // initialize a new instance of the component before each test
    beforeEach(
        inject(function (/* Inject the component */) {

        })
    );

    it('should do something', function() {
        expect(/* Something that was tested */).toBe(/* Test result expectation */);
    });
});
