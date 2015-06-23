'use strict';

describe('Service: TopologyTypes', function () {

    var mtopologyTypes;
    var typesList = [];

    beforeEach(module('cosmoUiApp', 'backend-mock'));
    beforeEach(inject(function (TopologyTypes) {
        mtopologyTypes = TopologyTypes;
    }));

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
