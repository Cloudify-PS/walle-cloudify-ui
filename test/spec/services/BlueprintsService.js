'use strict';

describe('Service: BlueprintsService', function () {

    var mBlueprintsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp','backend-mock');

            // Initialize a new instance of BlueprintsService
            inject(function (BlueprintsService) {
                mBlueprintsService = BlueprintsService;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new BlueprintsService instance', function() {
            expect(mBlueprintsService).not.toBeUndefined();
        });

        it('should have list method', function(){
            expect(mBlueprintsService.list).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(mBlueprintsService, 'list');
            mBlueprintsService.list();
        });

        it('tracks that the spy was called list', function() {
            expect(mBlueprintsService.list).toHaveBeenCalled();
        });

        it('tracks its number of list calls', function() {
            expect(mBlueprintsService.list.calls.length).toEqual(1);
        });

    });

});
