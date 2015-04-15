'use strict';

describe('Service: CloudifyService', function () {

    var mCloudifyService;

    beforeEach(module('cosmoUiApp','backend-mock'));
    beforeEach(inject(function (CloudifyService) {

        mCloudifyService = CloudifyService;
    }));

    describe('Unit tests', function() {

        it('should create a new CloudifyService instance', function() {
            expect(mCloudifyService).not.toBeUndefined();
        });

        it('should have autoPull method', function(){
            expect(mCloudifyService.autoPull).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(mCloudifyService, 'autoPull');
            mCloudifyService.autoPull('getNode', {}, mCloudifyService.getNode);
        });

        it('tracks that the spy was called autoPull', function() {
            expect(mCloudifyService.autoPull).toHaveBeenCalled();
        });

        it('tracks its number of autoPull calls', function() {
            expect(mCloudifyService.autoPull.calls.length).toEqual(1);
        });

    });


});
