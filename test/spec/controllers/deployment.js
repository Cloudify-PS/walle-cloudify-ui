'use strict';

describe('Controller: DeploymentCtrl', function () {

    var DeploymentCtrl, scope;
    var executions = [
        {
            "status": "terminated",
            "created_at": "2014-09-01 02:38:16.959561",
            "workflow_id": "create_deployment_environment",
            "parameters": {
                "policy_configuration": {
                    "policy_types": {},
                    "policy_triggers": {},
                    "groups": {}
                },
                "management_plugins_to_install": [
                    {
                        "url": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m2.zip",
                        "agent_plugin": "false",
                        "name": "openstack",
                        "manager_plugin": "true"
                    }
                ],
                "workflow_plugins_to_install": [
                    {
                        "agent_plugin": "false",
                        "name": "default_workflows",
                        "manager_plugin": "true"
                    }
                ]
            },
            "blueprint_id": "blueprint1",
            "deployment_id": "deployment1",
            "error": "",
            "id": "f0e1fef2-fd1d-4e68-a125-9a1743e81cc0"
        },
        {
            "status": "failed",
            "created_at": "2014-09-01 02:46:09.516843",
            "workflow_id": "install",
            "parameters": {},
            "blueprint_id": "blueprint1",
            "deployment_id": "deployment1",
            "error": "Traceback (most recent call last):\n  File \"/home/ubuntu/cloudify.nc1_dep1_workflows/env/local/lib/python2.7/site-packages/cloudify/decorators.py",
            "id": "f9c17f31-cb11-4b0e-bde4-92ba67d89f9e"
        }
    ];

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    // Initialize the controller and a mock scope
    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, RestService, EventsService) {

            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/monitor/graphs").respond(200);
            $httpBackend.whenGET("/backend/node-instances").respond(200);
            $httpBackend.whenPOST("/backend/deployments/nodes").respond(200);
            $httpBackend.whenPOST("/backend/nodes").respond(200);

            scope = $rootScope.$new();

            EventsService.newInstance = function() {
                return {
                    setAutoPullByDate: function() {},
                    filter: function() {},
                    stopAutoPull: function() {},
                    sort: function() {},
                    execute: function() {}
                }
            };

            RestService.getDeploymentById = function() {
                var deferred = $q.defer();
                var deployment = {
                    "blueprint_id": "blueprint1",
                    "created_at": "2014-09-01 02:38:16.959561",
                    "workflows": [{
                        "created_at": null,
                        "name": "install",
                        "parameters": {}
                    }, {
                        "created_at": null,
                        "name": "uninstall",
                        "parameters": {}
                    }],
                    "id": "deployment1",
                    "updated_at": "2014-09-01 02:38:16.959561"
                };

                deferred.resolve(deployment);

                return deferred.promise;
            };

            RestService.getDeploymentExecutions = function() {
                var deferred = $q.defer();

                deferred.resolve(executions);

                return deferred.promise;
            };

            DeploymentCtrl = $controller('DeploymentCtrl', {
                $scope: scope,
                RestService: RestService,
                EventsService: EventsService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(DeploymentCtrl).not.toBeUndefined();
        });

        it('should load executions list into executionsList scope variable', function() {
            waitsFor(function() {
                return scope.executionsList.length > 0;
            });

            runs(function() {
                expect(scope.executionsList).toBe(executions);
            });
        });
    });
});
