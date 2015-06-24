'use strict';

describe('Service: ExecutionsService', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var mExecutionsService;
    beforeEach(inject(function (ExecutionsService) {
        mExecutionsService = ExecutionsService;
    }));

    it('should do something', function () {
        expect(!!mExecutionsService).toBe(true);
    });

    describe('#isRunning', function(){
        it('should return false if no execution or status', function(){
            expect(mExecutionsService.isRunning(null)).toBe(false);
            expect(mExecutionsService.isRunning(undefined)).toBe(false);
            expect(mExecutionsService.isRunning({})).toBe(false);
        });

        it('should return false if status is failed,terminated or cancelled. otherwise true.', function(){
            expect(mExecutionsService.isRunning({status:'failed'})).toBe(false);
            expect(mExecutionsService.isRunning({status:'terminated'})).toBe(false);
            expect(mExecutionsService.isRunning({status:'cancelled'})).toBe(false);
            expect(mExecutionsService.isRunning({status:'foo'})).toBe(true);
        });
    });

    describe('#canPause', function(){
        it('should return true if workflow_id is create_deployment_environment', function(){
            expect(mExecutionsService.canPause({workflow_id:'create_deployment_environment'})).toBe(false);
            expect(mExecutionsService.canPause({workflow_id:'foo'})).toBe(true);
        });
    });

});
