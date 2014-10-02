'use strict';

describe('Service: NodeSearchService', function () {

    var NodeSearchService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // Initialize a new instance of NodeSearchService
            inject(function (_NodeSearchService_) {
                NodeSearchService = _NodeSearchService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new NodeSearchService instance', function() {
            expect(NodeSearchService).not.toBeUndefined();
        });

    });

});
