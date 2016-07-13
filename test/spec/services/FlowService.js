'use strict';

describe('Service: FlowService', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    // instantiate service
    var FlowService, cloudifyClient, TickerSrv, $timeout;
    beforeEach(inject(function (_FlowService_, _cloudifyClient_, _TickerSrv_, _$timeout_) {
        FlowService = _FlowService_;
        cloudifyClient = _cloudifyClient_;
        TickerSrv = _TickerSrv_;
        $timeout = _$timeout_;

        spyOn(cloudifyClient.deployments, 'create').and.returnValue(window.mockPromise(null, {data:{message: 'bla'}}));
        spyOn(cloudifyClient.executions, 'list').and.returnValue(window.mockPromise(null, {data:{message: 'bla2'}}));
        spyOn(cloudifyClient.executions, 'start').and.returnValue(window.mockPromise(null, {data:{message: 'bla3'}}));
        spyOn(TickerSrv, 'unregister').and.callThrough();
        spyOn(TickerSrv, 'register').and.callFake(function(id, callback){
            callback();
        });
    }));

    function flush(){
        // forces digest to resolve / reject promise
        $timeout.flush();
    }

    function fail(message){
        throw new Error(message);
    }

    it('should fail deploying', function (done) {
        FlowService.deployAndExecute('blueprint','dep',{},'install')
            .then(function(){
                fail('promise should have been rejected');
            },function(result){
                expect(result).toEqual({failed: 'deploying', response: {data:{message: 'bla'}}});
            }).finally(done);

        flush();
    });

    it('should fail waiting for deployment initialization', function(done){
        cloudifyClient.deployments.create.and.returnValue(window.mockPromise({}));

        FlowService.deployAndExecute('blueprint','dep',{},'install')
            .then(function(){
                fail('promise should have been rejected');
            },function(result){
                expect(result).toEqual({failed: 'getInitializeStatus', response: {data:{message: 'bla2'}}});
            }).finally(done);

        flush();
    });

    it('should fail initializing', function(done){
        var execution = {status:'failed'};
        cloudifyClient.deployments.create.and.returnValue(window.mockPromise({}));
        cloudifyClient.executions.list.and.returnValue(window.mockPromise({data:{items:[execution]}}));

        FlowService.deployAndExecute('blueprint','dep',{},'install')
            .then(function(){
                fail('promise should have been rejected');
            },function(result){
                expect(TickerSrv.unregister).toHaveBeenCalledWith('FlowService/pollExecutions');
                expect(result).toEqual({failed: 'initializing', execution: execution});
            }).finally(done);

        flush();
    });

    it('should fail to execute', function(done){
        var execution = {status:'terminated'};
        cloudifyClient.deployments.create.and.returnValue(window.mockPromise({}));
        cloudifyClient.executions.list.and.returnValue(window.mockPromise({data:{items:[execution]}}));

        FlowService.deployAndExecute('blueprint','dep',{},'install')
            .then(function(){
                fail('promise should have been rejected');
            },function(result){
                expect(TickerSrv.unregister).toHaveBeenCalledWith('FlowService/pollExecutions');
                expect(result).toEqual({failed: 'executing', response: {data:{message: 'bla3'}}});
            }).finally(done);

        flush();
    });

    it('should succeed to deploy and execute', function(done){
        var execution = {status:'terminated'};
        cloudifyClient.deployments.create.and.returnValue(window.mockPromise({}));
        cloudifyClient.executions.list.and.returnValue(window.mockPromise({data:{items:[execution]}}));
        cloudifyClient.executions.start.and.returnValue(window.mockPromise({}));

        FlowService.deployAndExecute('blueprint','dep',{},'install')
            .then(function(result){
                expect(TickerSrv.unregister).toHaveBeenCalledWith('FlowService/pollExecutions');
                expect(result).toBe(undefined);
            },function(){
                fail('promise should have been resolved');
            }).finally(done);

        flush();
    });
});
