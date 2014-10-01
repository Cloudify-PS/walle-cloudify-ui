'use strict';

describe('Service: CloudifyService', function () {

    var CloudifyService, HttpBackend;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // Initialize a new instance of CloudifyService
            inject(function (_CloudifyService_, $httpBackend) {
                CloudifyService = _CloudifyService_;
                $httpBackend.whenPOST('/backend/node-instances').respond({});
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new CloudifyService instance', function() {
            expect(CloudifyService).not.toBeUndefined();
        });

        var result;
        beforeEach(function(){
            CloudifyService.getNodeInstances().then(function(data){ result = data; })
        });

        it('should get node-instances from cloudify backend', function() {
            expect(result).toBe({});
        });




    });

});
