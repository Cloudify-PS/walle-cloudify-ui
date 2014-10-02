'use strict';

describe('Service: RestLoader', function () {

    var RestLoader;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // Initialize a new instance of RestLoader
            inject(function (_RestLoader_) {
                RestLoader = _RestLoader_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new RestLoader instance', function() {
            expect(RestLoader).not.toBeUndefined();
        });

    });

});
