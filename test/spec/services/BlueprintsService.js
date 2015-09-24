'use strict';

describe('Service: BlueprintsService', function () {

    var mBlueprintsService;

    // Load the app module
    beforeEach(module('cosmoUiApp', 'backend-mock'));
    beforeEach(
        inject(function (BlueprintsService) {
            mBlueprintsService = BlueprintsService;

        }));
    describe('Unit tests', function() {

        it('should create a new BlueprintsService instance', function() {
            expect(mBlueprintsService).not.toBeUndefined();
        });

    });

});
