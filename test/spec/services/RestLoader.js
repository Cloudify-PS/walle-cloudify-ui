'use strict';

describe('Service: RestLoader', function () {

    var mRestLoader;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper', function ($translateProvider) {
                $translateProvider.translations('en', {});
            });

            // Initialize a new instance of mRestLoader
            inject(function (RestLoader) {
                mRestLoader = RestLoader;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new mRestLoader instance', function() {
            expect(mRestLoader).not.toBeUndefined();
        });

        it('should have load method', function(){
            expect(mRestLoader.load).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(mRestLoader, 'load');
            mRestLoader.load();
        });

        it('tracks that the spy was called load', function() {
            expect(mRestLoader.load).toHaveBeenCalled();
        });

        it('tracks its number of load calls', function() {
            expect(mRestLoader.load.calls.length).toEqual(1);
        });

    });

});
