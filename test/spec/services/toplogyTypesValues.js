'use strict';

describe('Service: topologyTypesValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper'));

    // instantiate service
    var topologyTypesValues;
    beforeEach(inject(function (_topologyTypesValues_) {
        topologyTypesValues = _topologyTypesValues_;
    }));

    it('should create topologyTypesValues variable', function () {
        expect(!!topologyTypesValues).toBe(true);
    });

    it('should include cloudify.nodes.Root node type', function() {
        expect(!!topologyTypesValues['cloudify.nodes.Root']).toBe(true);
    });

});
