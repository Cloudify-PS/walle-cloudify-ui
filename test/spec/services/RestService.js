'use strict';

describe('Service: RestService', function () {
    var restService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp', 'ngMock');

            // initialize a new instance of the filter
            inject(function (RestService, $httpBackend) {
                $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
                $httpBackend.whenGET("/backend/versions/ui").respond(200);
                $httpBackend.whenGET("/backend/versions/manager").respond(200);
                $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

                restService = RestService;
            });
        });
    });

    describe('Unit tests', function() {
        it('should create a new RestService instance', function() {
            expect(restService).not.toBeUndefined();
        });

        if('should call addDeployment with all given parameters', function() {
            // create new deployment with all parameters and make sure all params passed to backend
        });
    });
});
