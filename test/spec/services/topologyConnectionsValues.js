'use strict';

describe('Service: topologyConnectionsValues', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper'));

    // instantiate service
    var topologyConnectionsValues;
    beforeEach(inject(function (_topologyConnectionsValues_) {
        topologyConnectionsValues = _topologyConnectionsValues_;
    }));

    it('should create topologyConnectionsValues variable', function () {
        expect(!!topologyConnectionsValues).toBe(true);
    });

    it('should include FloatingIp in array', function() {
        expect(topologyConnectionsValues.indexOf('FloatingIp')).toEqual(0);
    });

});
