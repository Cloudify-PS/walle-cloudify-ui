'use strict';

/*jshint camelcase: false */
describe('Controller: DeploymentProgressPanelCtrl', function () {

    var DeploymentProgressPanelCtrl, scope;
    var _nodes = [
        {
            'node_id': 'node1',
            'state': 'started',
            'deployment_id': 'deployment1',
            'id': 'node1_de274',
            'node_instances': [
                {
                    'deployment_id': 'deployment1',
                    'state': 'uninitialized'
                }
            ]
        },
        {
            'node_id': 'node2',
            'state': 'uninitialized',
            'deployment_id': 'deployment1',
            'id': 'node2_017f8',
            'node_instances': [
                {
                    'deployment_id': 'deployment1',
                    'state': 'uninitialized'
                },
                {
                    'deployment_id': 'deployment1',
                    'state': 'started'
                }
            ]
        },
        {
            'node_id': 'node3',
            'state': 'uninitialized',
            'deployment_id': 'deployment1',
            'id': 'node3_25649',
            'node_instances': [
                {
                    'deployment_id': 'deployment1',
                    'state': 'uninitialized'
                },
                {
                    'deployment_id': 'deployment1',
                    'state': 'started'
                },
                {
                    'deployment_id': 'deployment1',
                    'state': 'failed'
                }
            ]
        }
    ];

    var _currentExecution = {
        'status': 'started',
        'created_at': '2014-10-02 01:01:28.049253',
        'workflow_id': 'install',
        'parameters': {},
        'blueprint_id': 'blueprint1',
        'deployment_id': 'deployment1',
        'error': '',
        'id': 'a271b39d-8f34-474e-acae-34eb63f227b1'
    };

    var _hits = {
        hits: {
            hits: [
                {
                    '_type': 'cloudify_event',
                    '_source': {
                        'event_type': 'task_started',
                        'timestamp': '2014-10-05 00:45:00.000',
                        '@timestamp': '2014-10-05T00:45:00.000+00:00',
                        'message_code': null,
                        'context': {
                            'task_id': '375e9fcf-353c-45cd-a652-831915c422e4',
                            'blueprint_id': 'blueprint1',
                            'task_target': 'deployment1',
                            'node_name': 'node1',
                            'workflow_id': 'install',
                            'node_id': 'node1_de274',
                            'task_name': 'worker_installer.tasks.install',
                            'operation': 'cloudify.interfaces.worker_installer.install',
                            'deployment_id': 'deployment1',
                            'execution_id': 'a271b39d-8f34-474e-acae-34eb63f227b1'
                        },
                        'message': {
                            'text': 'Task started \'worker_installer.tasks.install\' [attempt 2]',
                            'arguments': null
                        },
                        'type': 'cloudify_event'
                    },
                    '_index': 'cloudify_events',
                    '_id': '_7V8T5ETS-eH2gLHGkSiQQ'
                },
                {
                    '_type': 'cloudify_event',
                    '_source': {
                        'event_type': 'task_started',
                        'timestamp': '2014-10-05 00:44:00.000',
                        '@timestamp': '2014-10-05T00:44:00.000+00:00',
                        'message_code': null,
                        'context': {
                            'task_id': 'e42326c7-c878-40c1-bca6-910153c1e73d',
                            'blueprint_id': 'blueprint1',
                            'task_target': 'deployment1',
                            'node_name': 'node1',
                            'workflow_id': 'install',
                            'node_id': 'node1_de274',
                            'task_name': 'worker_installer.tasks.install',
                            'operation': 'cloudify.interfaces.worker_installer.install',
                            'deployment_id': 'deployment1',
                            'execution_id': 'a271b39d-8f34-474e-acae-34eb63f227b1'
                        },
                        'message': {
                            'text': 'Task started \'worker_installer.tasks.install\'',
                            'arguments': null
                        },
                        'type': 'cloudify_event'
                    },
                    '_index': 'cloudify_events',
                    '_id': 'Qc0PLZyCTxuPw2LXiHT8vg'
                }
            ]
        }
    };

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    // Initialize the controller and a mock scope
    describe('Test setup', function () {
        it('', inject(function ($controller, $rootScope, $httpBackend, EventsService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            EventsService.newInstance = function () {
                return {
                    filter: function () {
                        return null;
                    },
                    execute: function (callbackFn) {
                        callbackFn(_hits);
                    },
                    stopAutoPull: function () {
                        return null;
                    }
                };
            };

            scope = $rootScope.$new();
            scope.currentExecution = _currentExecution;

            DeploymentProgressPanelCtrl = $controller('DeploymentProgressPanelCtrl', {
                $scope: scope,
                EventsService: EventsService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function () {
        it('should create a controller', function () {
            expect(DeploymentProgressPanelCtrl).not.toBeUndefined();
        });

        it('should be opened when toggling while panelOpen variable is false', function () {
            scope.panelOpen = false;

            scope.togglePanel();

            expect(scope.panelOpen).toBe(true);
        });

        it('should be closed when toggling while panelOpen variable is true', function () {
            scope.panelOpen = true;

            scope.togglePanel();

            expect(scope.panelOpen).toBe(false);
        });

        it('should update panel data to be empty before nodes are updated', function () {
            scope.$apply();

            expect(scope.panelData).toEqual({});
        });

        it('should update panel data when nodes are updated', function () {
            scope.nodes = _nodes;
            scope.$apply();

            expect(scope.panelData.node1).toBeDefined();
            expect(scope.panelData.node1.totalCount).toBe(1);
            expect(scope.panelData.node1.status).toBe('started');
            expect(scope.panelData.node1.inProgress.count).toBe(1);

            expect(scope.panelData.node2).toBeDefined();
            expect(scope.panelData.node2.totalCount).toBe(2);
            expect(scope.panelData.node2.inProgress.count).toBe(1);
            expect(scope.panelData.node2.started.count).toBe(1);

            expect(scope.panelData.node3).toBeDefined();
            expect(scope.panelData.node3.totalCount).toBe(3);
            expect(scope.panelData.node3.inProgress.count).toBe(1);
            expect(scope.panelData.node3.started.count).toBe(1);
            expect(scope.panelData.node3.failed.count).toBe(1);
        });

        it('should set the earliest execution time as start_time', function () {
            scope.nodes = _nodes;
            scope.currentExecution = _currentExecution;
            var expectedTimestamp = new Date().getTime() - new Date('2014-10-05T00:44:00.000+00:00').getTime();
            var expectedTime = {
                seconds: Math.floor((expectedTimestamp / 1000) % 60),
                minutes: Math.floor(((expectedTimestamp / (60000)) % 60)),
                hours: Math.floor(((expectedTimestamp / (3600000)) % 24)),
                days: Math.floor(((expectedTimestamp / (3600000)) / 24))
            };
            scope.$apply();

            waitsFor(function () {
                return scope.panelData.node1 !== undefined;
            });
            runs(function () {
                expect(JSON.stringify(scope.panelData.node1.start_time)).toBe(JSON.stringify(expectedTime));
            });
        });
    });
});
