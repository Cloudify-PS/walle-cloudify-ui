'use strict';

describe('Service: topologyTypes', function () {

    var topologyTypes;
    var typesList = [];

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of NodeSearchService
            inject(function (_topologyTypes_) {
                topologyTypes = _topologyTypes_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should have getList method', function(){
            expect(topologyTypes.getList).not.toBeUndefined();
        });

        beforeEach(function(){
            typesList = topologyTypes.getList();
        });

        it('should have list of 17 topology types', function() {
            expect(Object.keys(typesList).length).toBe(17);
        });

    });

});
