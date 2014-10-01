'use strict';

describe('Service: CloudifyService', function () {

    var CloudifyService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // Initialize a new instance of CloudifyService
            inject(function (_CloudifyService_) {
                CloudifyService = _CloudifyService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new CloudifyService instance', function() {
            expect(_CloudifyService).not.toBeUndefined();
        });

    });

});
