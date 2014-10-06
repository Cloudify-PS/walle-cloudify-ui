'use strict';

describe('Service: NodeSearchService', function () {

    var helper = new Helper();
    var NodeSearchService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // inject UI
            helper.injectUi();

            // Initialize a new instance of NodeSearchService
            inject(function (_NodeSearchService_) {
                helper.addInjects([
                    {
                        url: '/backend/blueprints',
                        respond: 200
                    }
                ]);
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
