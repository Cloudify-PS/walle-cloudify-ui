'use strict';

describe('Service: cloudifyLoginInterceptor', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp','gsUiHelper', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    // instantiate service
    var cloudifyLoginInterceptor;
    beforeEach(inject(function (_cloudifyLoginInterceptor_) {
        cloudifyLoginInterceptor = _cloudifyLoginInterceptor_;
    }));

    it('should do something', function () {
        expect(!!cloudifyLoginInterceptor).toBe(true);
    });

});
