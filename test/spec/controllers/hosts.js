'use strict';

describe('Controller: HostsCtrl', function () {

    var HostsCtrl, scope, nodes;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // Initialize the controller and a mock scope
    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {

            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();
            CloudifyService.loadBlueprints = function() {
                var deferred = $q.defer();
                var blueprints = [{
                    "id": "blueprint1",
                    "deployments": [{
                        "blueprint_id": "blueprint1",
                        "id": "deployment1"
                    }]
                }];

                deferred.resolve(blueprints);

                return deferred.promise;
            };

            CloudifyService.getNodes = function() {
                var deferred = $q.defer();
                var nodes = [
                    {
                        "type_hierarchy": ["cloudify.types.base", "cloudify.types.host", "cloudify.openstack.server", "vm_host"],
                        "blueprint_id": "blueprint1",
                        "host_id": "mongod_vm",
                        "id": "mongod_vm",
                        "number_of_instances": "1",
                        "deployment_id": "deployment1",
                        "type": "vm_host"
                    },
                    {
                        "type_hierarchy": ["cloudify.types.base", "cloudify.openstack.server"],
                        "blueprint_id": "blueprint1",
                        "host_id": "server",
                        "id": "server",
                        "number_of_instances": "1",
                        "deployment_id": "deployment1",
                        "type": "server"
                    }
                ];

                deferred.resolve(nodes);

                return deferred.promise;
            };

            CloudifyService.getDeploymentNodes = function() {
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

            HostsCtrl = $controller('HostsCtrl', {
                $scope: scope,
                CloudifyService: CloudifyService
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

        it('should load nodes only for the requested deployment', function() {
            scope.execute();
            scope.$apply();

            waitsFor(function() {
                return scope.hostsList.length > 0;
            });
            runs(function() {
                expect(scope.hostsList.length).toBe(1);
                expect(scope.hostsList[0].node_id).toBe('mongod_vm');
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
