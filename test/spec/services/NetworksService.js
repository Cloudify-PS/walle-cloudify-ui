'use strict';

describe('Service: NetworksService', function () {

    var NetworksService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // Initialize a new instance of NetworksService
            inject(function (_NetworksService_) {
                NetworksService = _NetworksService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new NetworksService instance', function() {
            expect(NetworksService).not.toBeUndefined();
        });

    });

});
