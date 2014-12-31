'use strict';

describe('Service: BreadcrumbsService', function () {

    var mBreadcrumbsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of BreadcrumbsService
            inject(function (BreadcrumbsService) {
                mBreadcrumbsService = BreadcrumbsService;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new BreadcrumbsService instance', function() {
            expect(mBreadcrumbsService).not.toBeUndefined();
        });

    });

});
