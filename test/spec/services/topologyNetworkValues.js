'use strict';

describe('Service: TopologyNetworkValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    // instantiate service
    var topologyNetworkValues;
    beforeEach(inject(function (_TopologyNetworkValues_) {
        topologyNetworkValues = _TopologyNetworkValues_;
    }));

    it('should create topologyNetworkValues variable', function () {
        expect(!!topologyNetworkValues).toBe(true);
    });

    it('should include FloatingIp in array', function() {
        expect(topologyNetworkValues.indexOf('cloudify-nodes-FloatingIP')).toEqual(0);
    });

});
