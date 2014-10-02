'use strict';

describe('Service: BlueprintsService', function () {

    var helper = new Helper();
    var BlueprintsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // inject UI
            helper.injectUi();

            // Initialize a new instance of BlueprintsService
            inject(function (_BlueprintsService_) {
                BlueprintsService = _BlueprintsService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new BlueprintsService instance', function() {
            expect(BlueprintsService).not.toBeUndefined();
        });

    });

});
