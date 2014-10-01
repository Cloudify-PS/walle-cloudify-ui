'use strict';

describe('Service: BlueprintsService', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var BlueprintsService;
    beforeEach(inject(function (_BlueprintsService_) {
        BlueprintsService = _BlueprintsService_;
    }));

    it('should do something', function () {
        expect(!!BlueprintsService).toBe(true);
    });

});
