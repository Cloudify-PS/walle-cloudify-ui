'use strict';

describe('Service: cloudifyClient', function () {

    var httpReturnObject = null;

    var successResult = null;
    var errorResult = null;

    // load the service's module
    beforeEach(module('cosmoUiApp', function ($provide) {

        successResult = null;
        errorResult = null;
        httpReturnObject = {
            then: function (success, error) { // mock $http..
                if (successResult) {
                    success(successResult);
                }
                if (errorResult) {
                    error(errorResult);
                }
                return 'bar';

            }, success: function () {
                return {
                    error: function () {
                    }
                };
            }
        };
        $provide.value('$http', jasmine.createSpy().andCallFake(function () {
            return httpReturnObject;
        }));
        $provide.value('$timeout', function (callback) {
            callback();
        });
    }));

    // instantiate service
    var mcloudifyClient;
    beforeEach(inject(function (cloudifyClient) {
        mcloudifyClient = cloudifyClient;
    }));

    it('should do something', function () {
        expect(!!mcloudifyClient).toBe(true);
    });

    describe('#config', function () {
        it('should point to /backend/cloudify-api', function () {
            expect(mcloudifyClient.config.endpoint).toBe('/backend/cloudify-api');
        });

        it('should override request', function () {
            expect(mcloudifyClient.config.request).not.toBe(null);
        });

        describe('#config.request', function () {

            it('should invoke $http', inject(function ($http) {
                var returnValue = mcloudifyClient.config.request({});
                expect($http).toHaveBeenCalled();
                expect(returnValue).toBe('bar');
            }));

            it('calls callback on success', function () {
                var callback = jasmine.createSpy('callback function');
                successResult = 'foo';
                mcloudifyClient.config.request({}, callback);
                expect(callback).toHaveBeenCalledWith(null, successResult, undefined);

                successResult = {'data': 'bar'};
                mcloudifyClient.config.request({}, callback);
                expect(callback).toHaveBeenCalledWith(null, successResult, 'bar');

            });

            it('calls callbacks on error', function () {
                var callback = jasmine.createSpy('callback function');
                errorResult = 'bar';
                mcloudifyClient.config.request({}, callback);
                expect(callback).toHaveBeenCalledWith(null, errorResult);
            });
        });
    });

});
