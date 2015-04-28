'use strict';

describe('Service: TopologyConnectionsValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper'));

    // instantiate service
    var topologyConnectionsValues;
    beforeEach(inject(function (_TopologyConnectionsValues_) {
        topologyConnectionsValues = _TopologyConnectionsValues_;
    }));

    it('should create topologyConnectionsValues variable', function () {
        expect(!!topologyConnectionsValues).toBe(true);
    });

    it('should include FloatingIp in array', function() {
        expect(topologyConnectionsValues.indexOf('cloudify-nodes-FloatingIp')).toEqual(0);
    });

});
