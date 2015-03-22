'use strict';

describe('Service: topologyNetworkValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper'));

    // instantiate service
    var topologyNetworkValues;
    beforeEach(inject(function (_topologyNetworkValues_) {
        topologyNetworkValues = _topologyNetworkValues_;
    }));

    it('should create topologyNetworkValues variable', function () {
        expect(!!topologyNetworkValues).toBe(true);
    });

    it('should include FloatingIp in array', function() {
        expect(topologyNetworkValues.indexOf('FloatingIp')).toEqual(0);
    });

});
