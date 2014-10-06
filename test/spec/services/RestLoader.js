'use strict';

describe('Service: RestLoader', function () {

    var helper = new Helper();
    var RestLoader;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // inject UI
            helper.injectUi();

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

        it('should have load method', function(){
            expect(RestLoader.load).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(RestLoader, 'load');
            RestLoader.load();
        });

        it("tracks that the spy was called load", function() {
            expect(RestLoader.load).toHaveBeenCalled();
        });

        it("tracks its number of load calls", function() {
            expect(RestLoader.load.calls.length).toEqual(1);
        });

    });

});
