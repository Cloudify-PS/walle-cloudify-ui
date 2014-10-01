'use strict';

describe('Service: DeploymentsService', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var DeploymentsService;
    beforeEach(inject(function (_DeploymentsService_) {
        DeploymentsService = _DeploymentsService_;
    }));

    it('should do something', function () {
        expect(!!DeploymentsService).toBe(true);
    });

});
