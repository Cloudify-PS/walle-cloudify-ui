'use strict';

describe('Service: NodeSearchService', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var NodeSearchService;
    beforeEach(inject(function (_NodeSearchService_) {
        NodeSearchService = _NodeSearchService_;
    }));

    it('should do something', function () {
        expect(!!NodeSearchService).toBe(true);
    });

});
