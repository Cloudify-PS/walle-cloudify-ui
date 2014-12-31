'use strict';

describe('Controller: DeploymentsCtrl', function () {
    var DeploymentsCtrl, scope;
    var _execution = {

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

    beforeEach(module('cosmoUiApp', 'ngMock'));

    function _testSetup() {
        inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');
            $httpBackend.whenGET('/backend/blueprints').respond(200);

            scope = $rootScope.$new();

            CloudifyService.deployments.updateExecutionState = function () {
                var deferred = $q.defer();

                deferred.resolve(_execution);

                return deferred.promise;
            };

            CloudifyService.deployments.getDeploymentExecutions = function () {
                var deferred = $q.defer();

                deferred.resolve(_executions);

                return deferred.promise;
            };

            CloudifyService.blueprints.list = function () {
                var deferred = $q.defer();

                deferred.resolve(_blueprints);

                return deferred.promise;
            };

            DeploymentsCtrl = $controller('DeploymentsCtrl', {
                $scope: scope,
                CloudifyService: CloudifyService
            });

            scope.$digest();
        });
    }

    describe('Test setup', function () {
        it('', function () {
            _testSetup(true);
        });
    });

    describe('Controller tests', function () {
        it('should create a controller', function () {
            expect(DeploymentsCtrl).not.toBeUndefined();
        });

        it('should return selected workflow id', function () {
            scope.selectedDeployment = _deployment;

            expect(scope.getExecutionAttr(scope.selectedDeployment, 'id')).toBe(_executions[1].id);
        });


    });
});