'use strict';

describe('Controller: HostsCtrl', function () {

    var HostsCtrl, scope, nodes;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // Initialize the controller and a mock scope
    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService, NodeSearchService) {

            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/blueprints").respond(200);

            scope = $rootScope.$new();

            NodeSearchService.execute = function() {
                var deferred = $q.defer();
                var result = [{
                    "type_hierarchy": ["cloudify.types.base", "cloudify.types.host", "cloudify.openstack.server", "vm_host"],
                    "node_id": "nodejs_vm",
                    "state": "uninitialized",
                    "host_id": "nodejs_vm_6d2f0",
                    "deployment_id": "deployment1",
                    "id": "nodejs_vm_6d2f0",
                    "type": "vm_host"
                }, {
                    "type_hierarchy": ["cloudify.types.base", "cloudify.openstack.server"],
                    "node_id": "mongod_vm",
                    "state": "uninitialized",
                    "host_id": "mongod_vm_b9f82",
                    "deployment_id": "deployment1",
                    "id": "mongod_vm_b9f82",
                    "type": "server"
                }];

                deferred.resolve(result);

                return deferred.promise;
            };

            CloudifyService.deployments.getDeploymentNodes = function() {
                var deferred = $q.defer();
                var instances = [
                    {
                        deployment_id: "deployment1",
                        host_id: "mongod_vm_783c7",
                        id: "mongod_vm_0c2ae",
                        node_id: "mongod_vm",
                        runtime_properties: null,
                        state: "uninitialized"
                    },
                    {
                        deployment_id: "deployment1",
                        host_id: "mongod_783c7",
                        id: "mongod_0c2ae",
                        node_id: "mongod",
                        runtime_properties: null,
                        state: "uninitialized"
                    }
                ];

                deferred.resolve(instances);

                return deferred.promise;
            };

            NodeSearchService.getBlueprints = function() {
                return [{
                    "id": "blueprint1",
                    "deployments": [{
                        "blueprint_id": "blueprint1",
                        "id": "deployment1"
                    }]
                }];
            };

            HostsCtrl = $controller('HostsCtrl', {
                $scope: scope,
                NodeSearchService: NodeSearchService
            });

            scope.eventsFilter = {
                'blueprints': {
                    label: "blueprint1",
                    value: "blueprint1"
                },
                'deployments': {
                    label: "deployment1",
                    parent: "blueprint1",
                    value: "deployment1"
                }
            };

            scope.$digest();
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
