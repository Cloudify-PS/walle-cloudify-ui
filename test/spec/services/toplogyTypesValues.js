'use strict';

describe('Service: TopologyTypesValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper'));

    // instantiate service
    var topologyTypesValues;
    beforeEach(inject(function (_TopologyTypesValues_) {
        topologyTypesValues = _TopologyTypesValues_;
    }));

    it('should create topologyTypesValues variable', function () {
        expect(!!topologyTypesValues).toBe(true);
    });

    it('should include cloudify.nodes.Root node type', function() {
        expect(!!topologyTypesValues['cloudify.nodes.Root']).toBe(true);
    });

});
