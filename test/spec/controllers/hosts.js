'use strict';

describe('Controller: HostsCtrl', function () {

    /*jshint camelcase: false */
    var HostsCtrl, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService, NodeSearchService) {

        scope = $rootScope.$new();

        NodeSearchService.execute = function () {
            var deferred = $q.defer();
            var result = [{
                'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.Compute', 'cloudify.openstack.nodes.Server', 'vm_host'],
                'node_id': 'nodejs_vm',
                'state': 'uninitialized',
                'host_id': 'nodejs_vm_6d2f0',
                'deployment_id': 'deployment1',
                'id': 'nodejs_vm_6d2f0',
                'type': 'vm_host'
            }, {
                'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.openstack.nodes.Server'],
                'node_id': 'mongod_vm',
                'state': 'uninitialized',
                'host_id': 'mongod_vm_b9f82',
                'deployment_id': 'deployment1',
                'id': 'mongod_vm_b9f82',
                'type': 'server'
            }];

            deferred.resolve(result);

            return deferred.promise;
        };

        CloudifyService.deployments.getDeploymentNodes = function () {
            var deferred = $q.defer();
            var instances = [
                {
                    deployment_id: 'deployment1',
                    host_id: 'mongod_vm_783c7',
                    id: 'mongod_vm_0c2ae',
                    node_id: 'mongod_vm',
                    runtime_properties: null,
                    state: 'uninitialized'
                },
                {
                    deployment_id: 'deployment1',
                    host_id: 'mongod_783c7',
                    id: 'mongod_0c2ae',
                    node_id: 'mongod',
                    runtime_properties: null,
                    state: 'uninitialized'
                }
            ];
            deferred.resolve(instances);
            return deferred.promise;
        };

        NodeSearchService.getNodeSearchData = function () {
            var deferred = $q.defer();
            deferred.resolve({
                blueprints: [{
                    'id': 'blueprint1',
                    'deployments': [{
                        'blueprint_id': 'blueprint1',
                        'id': 'deployment1'
                    }]
                }],
                deployments: [{
                    'blueprint_id': 'blueprint1',
                    'id': 'deployment1'
                }]
            });
            return deferred.promise;
        };

        HostsCtrl = $controller('HostsCtrl', {
            $scope: scope,
            $filter: function () {
                return function () {
                };
            },
            NodeSearchService: NodeSearchService
        });

        scope.eventsFilter = {
            'blueprints': {
                label: 'blueprint1',
                value: 'blueprint1'
            },
            'deployments': {
                label: 'deployment1',
                parent: 'blueprint1',
                value: 'deployment1'
            }
        };

        scope.$digest();
    }));

    describe('#execute', function () {
        it('should call to ModelSearchService.execute', inject(function (NodeSearchService) {
            scope.eventsFilter = {blueprints: {value: 'bar'}};
            scope.$digest();
            spyOn(NodeSearchService, 'execute').andCallFake(function () {
                return {
                    then: function (success) {
                        success('foo');
                    }
                };
            });
            scope.execute();
            expect(scope.filterLoading).toBe(false);
            expect(scope.nodesList).toBe('foo');
            expect(scope.getBlueprintId()).toBe('bar');
            expect(NodeSearchService.execute).toHaveBeenCalled();

        }));

        it('should do nothing if sort is disabled', inject(function (NodeSearchService) {
            spyOn(scope, 'isSearchDisabled').andCallFake(function () {
                return true;
            });
            spyOn(NodeSearchService, 'execute');
            scope.execute();
            expect(NodeSearchService.execute).not.toHaveBeenCalled();
        }));
    });

    describe('eventsFilter.blueprints watch listener', function(){
        it('should reset values if newValue is null', inject(function(  ){
            scope.eventsFilter = { blueprints: null };
            scope.$digest();
            expect(scope.deploymentsList.length).toBe(0);

        }));
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(HostsCtrl).not.toBeUndefined();
        });

        it('should filter the blueprints list to the selected blueprint', function() {
            waitsFor(function() {
                return scope.blueprintsList.length > 0;
            });
            runs(function() {
                expect(scope.blueprintsList.length).toBe(1);
            });
        });

        it('should set isSearchDisabled flag to true if no blueprints were selected', function() {
            scope.eventsFilter.blueprints = [];

            scope.$apply();

            expect(scope.isSearchDisabled()).toBe(true);
        });

        it('should set isSearchDisabled flag to false if blueprints were selected', function() {
            scope.eventsFilter.blueprints = [{
                name: 'blueprint1'
            }];

            scope.$apply();

            expect(scope.isSearchDisabled()).toBe(false);
        });
    });
});
