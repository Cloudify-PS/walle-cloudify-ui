'use strict';

describe('Service: DeploymentsService', function () {

    var helper = new Helper();
    var DeploymentsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // inject UI
            helper.injectUi();

            // Initialize a new instance of DeploymentsService
            inject(function (_DeploymentsService_) {
                DeploymentsService = _DeploymentsService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new DeploymentsService instance', function() {
            expect(DeploymentsService).not.toBeUndefined();
        });

    });

});
