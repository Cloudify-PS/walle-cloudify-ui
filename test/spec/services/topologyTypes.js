'use strict';

describe('Service: topologyTypes', function () {

    var mtopologyTypes;
    var typesList = [];

    describe('Test setup', function () {
        it('Injecting required data & initializing a new instance', function () {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of NodeSearchService
            inject(function (topologyTypes) {
                mtopologyTypes = topologyTypes;
            });

        });
    });

    describe('Unit tests', function () {

        it('should have getList method', function () {
            expect(mtopologyTypes.getList).not.toBeUndefined();
        });

        beforeEach(function () {
            typesList = mtopologyTypes.getList();
        });

        it('should have list of 20 topology types', function () {
            expect(Object.keys(typesList).length).toBe(20);
        });
    });

});
