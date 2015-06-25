'use strict';

describe('Service: CloudifyService', function () {

    var mCloudifyService;

    beforeEach(module('cosmoUiApp','backend-mock'));
    beforeEach(inject(function (CloudifyService) {

        mCloudifyService = CloudifyService;
    }));

    // todo: find out if we need $httpBackend expect get on /backend/node/get (see merge)
    describe('Unit tests', function() {

        it('should create a new CloudifyService instance', function() {
            expect(mCloudifyService).not.toBeUndefined();
        });

    });


});
