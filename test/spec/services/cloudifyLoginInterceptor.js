'use strict';

describe('Service: cloudifyLoginInterceptor', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'backend-mock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    // instantiate service
    var cloudifyLoginInterceptor;
    beforeEach(inject(function (_cloudifyLoginInterceptor_, $q) {
        cloudifyLoginInterceptor = _cloudifyLoginInterceptor_;
        spyOn($q, 'reject');
    }));

    describe('#responseError', function () {
        it('should handle responseBody of string', inject(function ($q) {
            cloudifyLoginInterceptor.responseError({'data': '{"hello" : "world"}'});
            expect(window.location.hash).not.toBe('#/login');
            expect($q.reject).toHaveBeenCalled();
        }));

        it('should handle response body of type object', inject(function ($q) {
            cloudifyLoginInterceptor.responseError({'data': {'hello': 'world'}});
            expect(window.location.hash).not.toBe('#/login');
            expect($q.reject).toHaveBeenCalled();
        }));

        it('should redirect if status is 401 and errorCode is unauthorized_error', inject(function ($q) {
            cloudifyLoginInterceptor.responseError({'status': 401, data: {error_code: 'unauthorized_error'}});
            expect(window.location.hash).toBe('#/login');
            expect($q.reject).not.toHaveBeenCalled();
        }));
    });


});
