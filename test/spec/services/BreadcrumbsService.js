'use strict';

describe('Service: BreadcrumbsService', function () {

    var helper = new Helper();
    var BreadcrumbsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // inject UI
            helper.injectUi();

            // Initialize a new instance of BreadcrumbsService
            inject(function (_BreadcrumbsService_) {
                BreadcrumbsService = _BreadcrumbsService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new BreadcrumbsService instance', function() {
            expect(BreadcrumbsService).not.toBeUndefined();
        });

    });

});