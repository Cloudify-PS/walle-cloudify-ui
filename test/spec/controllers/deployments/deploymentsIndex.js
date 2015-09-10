'use strict';

describe('Controller: DeploymentsCtrl', function () {
    var DeploymentsCtrl, scope;


    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    function _testSetup() {
        inject(function ($controller, $rootScope, $httpBackend, $q,
                          cloudifyClient) {


            scope = $rootScope.$new();

            spyOn(cloudifyClient.executions,'list').andCallFake(function(){
                return {
                    then:function(/*success,error*/){}
                };
            });

            spyOn(cloudifyClient.deployments,'list').andCallFake(function(){
                return {
                    then: function (success/*, error*/) {
                        success({ data: []});
                    }
                };
            });




            spyOn(cloudifyClient.blueprints,'list').andCallFake(function () {
                return {
                    then:function(success){
                        success( { data : {} } );
                    }
                };
            });

            DeploymentsCtrl = $controller('DeploymentsCtrl', {
                $scope: scope
            });

            scope.$digest();
        });
    }

    describe('#loadExecutions', function(){

        var loadExecutions = null;
        var executions = null;

        beforeEach(inject(function( cloudifyClient, ExecutionsService, TickerSrv  ){

            spyOn(TickerSrv,'register').andCallFake(function( name, callback ){
                if ( name === 'deployments/loadExecutions' ){
                    loadExecutions = callback;

                }
            });

            _testSetup();
            executions = [{'deployment_id' : 'foo', name : 'bar', is_running: true }];
            cloudifyClient.executions.list.andReturn({ then : function(success/*, error*/){ success( { data : executions  } );}});

            spyOn(ExecutionsService,'isRunning').andCallFake(function( e){
                return !!e.is_running;
            });
        }));

        it('should reset execution on each iteration CFY-2238', function(){

            loadExecutions();
            expect(scope.getExecution({ 'id' : 'foo' } ).name).toBe('bar');
            executions[0].is_running = false;
            loadExecutions();
            expect(!scope.getExecution({ 'id' : 'foo' } )).toBe(true);
        });
    });

    describe('managerError', function () {
        it('should be initialized to true', function () {
            _testSetup();
            expect(scope.managerError).toBe(false);
        });
    });

    describe('isExecuting', function () {
        it('should return true if something is executing', function () {
            _testSetup();
            expect(scope.isExecuting()).toBe(false);
        });
    });

    describe('#redirectTo', function(){

        it('should redirect to deployment', inject(function( $location ){
            _testSetup();
            spyOn($location,'path');
            scope.redirectTo({'id' : 'foo'});
            expect($location.path).toHaveBeenCalledWith('/deployment/foo/topology');
        }));
    });

    describe('canPause', function(){
        it('should call ExecutionsService.canPause', inject(function( ExecutionsService){
            _testSetup();
            spyOn(ExecutionsService,'canPause');
            spyOn(scope,'getExecution');
            scope.canPause('foo');
            expect(scope.getExecution).toHaveBeenCalled();
            expect(ExecutionsService.canPause).toHaveBeenCalled();
        }));
    });


    describe('Controller tests', function () {

        it('should create a controller', function () {
            _testSetup();
            expect(DeploymentsCtrl).not.toBeUndefined();
        });

        it('should load deployment executions every X (>0) milliseconds', inject(function ($httpBackend, TickerSrv) {
            _testSetup();

            var loadExecutionRegistered = false;
            var handler = null;
            var interval = 0;

            spyOn(TickerSrv, 'register').andCallFake(function(id, _handler, _interval/*, delay, isLinear*/) {
                if ( id === 'deployments/loadExecutions' ){
                    loadExecutionRegistered = true;
                    handler = _handler;
                    interval = _interval;
                }

                expect(loadExecutionRegistered).toBe(true);
                expect(typeof(handler)).toBe('function');
                expect(handler.toString().indexOf('cloudifyClient.executions') >= 0).toBe(true);
                expect(interval > 0).toBe(true);

            });


        }));


        it('should toggle delete confirmation dialog when deleteBlueprint function is triggered', inject(function ( ngDialog  ) {
            _testSetup();

            spyOn(ngDialog, 'open').andReturn({});
            scope.deleteDeployment({ id : 'foo'});
            expect(ngDialog.open).toHaveBeenCalled();
        }));
    });
});
