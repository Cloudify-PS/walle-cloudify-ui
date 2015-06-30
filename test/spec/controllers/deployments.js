'use strict';

describe('Controller: DeploymentsCtrl', function () {
    var DeploymentsCtrl, scope;

    var _execution = {};

    var _deleteErr = {
        'data': {
            'message': 'Can\'t delete deployment',
            'error_code': 'dependent_exists_error',
            'server_traceback': 'Traceback'
        },
        'status': 400,
        'config': {
            'method': 'POST',
            'url': '/backend/deployments/delete',
            'data': {
                'deployment_id': 'deployment1',
                'ignoreLiveNodes': false
            },
            'headers': {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }
        },
        'statusText': 'Bad Request'
    };

    var _deployment = {
        'inputs': {},
        'blueprint_id': 'blueprint1',
        'created_at': '2014-12-07 09:50:10.427964',
        'workflows': [
            {
                'created_at': null,
                'name': 'execute_operation',
                'parameters': {
                    'operation_kwargs': {
                        'default': {}
                    },
                    'node_ids': {
                        'default': []
                    },
                    'node_instance_ids': {
                        'default': []
                    },
                    'run_by_dependency_order': {
                        'default': false
                    },
                    'operation': {},
                    'type_names': {
                        'default': []
                    }
                }
            },
            {
                'created_at': null,
                'name': 'install',
                'parameters': {}
            },
            {
                'created_at': null,
                'name': 'uninstall',
                'parameters': {}
            }
        ],
        'id': 'deployment1',
        'updated_at': '2014-12-07 09:50:10.427964'
    };

    var _executions = [
        {
            'status': 'failed',
            'created_at': '2014-12-08 09:43:01.520999',
            'workflow_id': 'install',
            'parameters': {},
            'blueprint_id': 'blueprint1',
            'deployment_id': 'deployment2',
            'error': '',
            'id': '303bf7a7-c8ed-4c47-b34b-b96c384a90d0'
        },
        {
            'status': 'started',
            'created_at': '2014-12-07 14:51:56.306199',
            'workflow_id': 'install',
            'parameters': {},
            'blueprint_id': 'blueprint1',
            'deployment_id': 'deployment1',
            'error': '',
            'id': '4a9dc7c2-6b5e-4ceb-95cb-8d2e3924f01a'
        }
    ];

    var _blueprints = [
        {
            'updated_at': '2014-08- 21 00:54:04.878540',
            'created_at': '2014-08-21 00:54:04.878540',
            'id': 'blueprint2',
            'deployments': []
        },
        {
            'updated_at': '2014-08-17 01:13:10.905309',
            'created_at': '2014-08-17 01:13:10.905309',
            'id': 'blueprint1',
            'deployments': [
                {
                    'workflows': [
                        {
                            'created_at': null,
                            'name': 'install',
                            'parameters': []
                        },
                        {
                            'created_at': null,
                            'name': 'uninstall',
                            'parameters': []
                        }
                    ],
                    'created_at': '2014-08-17 04:07:46.933729',
                    'blueprint_id': 'blueprint1',
                    'id': 'deployment1',
                    'updated_at': '2014-08-17 04:07:46.933729'
                }
            ]
        }
    ];

    beforeEach(module('cosmoUiApp', 'ngMock','templates-main', 'backend-mock'));

    function _testSetup() {
        inject(function ($controller, $rootScope, $httpBackend, $q,
                         CloudifyService, cloudifyClient, $location) {


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

            spyOn(CloudifyService.deployments, 'getDeploymentExecutions').andCallFake(function () {
                return {
                    then: function (success) {
                        success(_executions);
                    }
                };
            });

            $location.path('/deployments');

            spyOn(CloudifyService.deployments,'updateExecutionState').andCallFake(function () {
                return {
                    then:function( success ){
                        success(_execution);
                    }
                };
            });

            spyOn(CloudifyService.deployments,'deleteDeploymentById').andCallFake(function () {
                return {
                    then: function (success, error) {
                        error(_deleteErr);
                    }
                };
            });

            spyOn(cloudifyClient.blueprints,'list').andCallFake(function () {
                return {
                    then:function(success){
                        success( { data : _blueprints } );
                    }
                };
            });

            DeploymentsCtrl = $controller('DeploymentsCtrl', {
                $scope: scope
            });

            scope.$digest();
        });
    }

    describe('#showInputs', function(){
        beforeEach(_testSetup);

        it('should call ngDialog', inject(function( ngDialog ){

            spyOn(ngDialog, 'open' );
            scope.showInputs({});
            expect(ngDialog.open).toHaveBeenCalled();
        }));
    });

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
            executions = [{'deployment_id' : 'foo', is_running: true }];
            cloudifyClient.executions.list.andReturn({ then : function(success/*, error*/){ success( { data : executions  } );}});

            spyOn(ExecutionsService,'isRunning').andCallFake(function( e){
                return !!e.is_running;
            });







        }));

        it('should reset execution on each iteration CFY-2238', function(){
            loadExecutions();
            expect(scope.getExecution('foo').deployment_id).toBe('foo');
            executions[0].is_running = false;
            loadExecutions();
            expect(!scope.getExecution('foo')).toBe(true);
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

    describe('getWorkflows', function () {
        it('should return empty array by default', function () {
            _testSetup();
            expect(scope.getWorkflows({}).length).toBe(0);
        });
    });


    describe('#executeDeployment', function () {
        it('should run execute on deployments if enabled', inject(function (CloudifyService) {
            _testSetup();
            var executeResponse = {};
            var isExecuteEnabled = false;
            scope.isExecuteEnabled = jasmine.createSpy().andCallFake(function () {
                return isExecuteEnabled;
            });
            scope.selectedDeployment = {};
            scope.selectedWorkflow = {data: {parameters: ''}};
            spyOn(scope, 'redirectTo');

            scope.executeDeployment({});
            expect(scope.redirectTo).not.toHaveBeenCalled();

            isExecuteEnabled = true;

            spyOn(CloudifyService.deployments, 'execute').andCallFake(function () {
                return {
                    then: function (success) {
                        success(executeResponse);
                    }
                };
            });
            scope.executeDeployment({});
            expect(scope.redirectTo).toHaveBeenCalled();

            executeResponse = {'error_code': 'yes', 'message': 'foo'};
            scope.executeDeployment({});
            expect(scope.executedErr).toBe('foo');


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
            scope.deleteDeployment(_deployment);

            expect(scope.itemToDelete.id).toBe(_deployment.id);
            expect(ngDialog.open).toHaveBeenCalled();
        }));
    });
});
