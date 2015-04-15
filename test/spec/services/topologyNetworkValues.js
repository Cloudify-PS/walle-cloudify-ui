'use strict';

describe('Service: TopologyNetworkValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock'));

    // instantiate service
    var topologyNetworkValues;
    beforeEach(inject(function (_TopologyNetworkValues_) {
        topologyNetworkValues = _TopologyNetworkValues_;
    }));

    it('should create topologyNetworkValues variable', function () {
        expect(!!topologyNetworkValues).toBe(true);
    });

    it('should include FloatingIp in array', function() {
        expect(topologyNetworkValues.indexOf('FloatingIp')).toEqual(0);
    });

});
