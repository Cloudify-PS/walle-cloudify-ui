'use strict';

describe('Service: DeploymentsService', function () {

    var mDeploymentsService;


    beforeEach(module('cosmoUiApp', 'backend-mock'));

    // Initialize a new instance of DeploymentsService
    beforeEach(inject(function (DeploymentsService) {
        mDeploymentsService = DeploymentsService;
    }));

    describe('Unit tests', function () {

        it('should create a new DeploymentsService instance', function () {
            expect(mDeploymentsService).not.toBeUndefined();
        });

        it('should have execute method', function () {
            expect(mDeploymentsService.execute).not.toBeUndefined();
        });

        beforeEach(function () {
            spyOn(mDeploymentsService, 'execute');
            mDeploymentsService.execute();
        });

        it('tracks that the spy was called execute', function () {
            expect(mDeploymentsService.execute).toHaveBeenCalled();
        });

        it('tracks its number of execute calls', function () {
            expect(mDeploymentsService.execute.calls.length).toEqual(1);
        });

    });

});
