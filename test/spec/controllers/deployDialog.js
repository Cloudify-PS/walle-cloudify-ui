'use strict';

describe('Controller: DeploydialogCtrl', function () {
    var DeployDialogCtrl, scope;
    var _deployment = {
        "inputs": {
            "webserver_port": 8080,
            "image_name": "image_name",
            "agent_user": "agent_user",
            "flavor_name": "flavor_name"
        },
        "blueprint_id": "blueprint1",
        "id": "deployment1",
        "outputs": {
            "http_endpoint": {
                "description": "HTTP web server endpoint.",
                "value": {
                    "get_attribute": ["vm", "ip"]
                }
            }
        }
    };

    var _blueprint = {
        "id": "blueprint1",
        "plan": {
            "inputs": {
                "webserver_port": {
                    "default": 8080
                },
                "flavor_name": {
                },
                "agent_user": {
                },
                "image_name": {
                },
                "bool_variable": {
                    "default": false
                },
                "str_variable": {
                    "default": "some string"
                }
            },
            "workflows": {
                "execute_operation": {
                    "operation": "cloudify.plugins.workflows.execute_operation",
                    "parameters": {
                        "operation_kwargs": {
                            "default": {}
                        },
                        "node_ids": {
                            "default": []
                        },
                        "node_instance_ids": {
                            "default": []
                        },
                        "run_by_dependency_order": {
                            "default": false
                        },
                        "operation": {},
                        "type_names": {
                            "default": []
                        }
                    },
                    "plugin": "default_workflows"
                },
                "install": {
                    "operation": "cloudify.plugins.workflows.install",
                    "plugin": "default_workflows"
                },
                "uninstall": {
                    "operation": "cloudify.plugins.workflows.uninstall",
                    "plugin": "default_workflows"
                }
            }
        },
        "deployments": [{
            "inputs": {
                "flavor_name": "flavor_name",
                "webserver_port": 8080,
                "image_name": "image_name",
                "agent_user": "agent_user"
            },
            "blueprint_id": "blueprint1",
            "created_at": "2014-11-10 23:15:06.908209",
            "workflows": [{
                "created_at": null,
                "name": "execute_operation",
                "parameters": {
                    "operation_kwargs": {
                        "default": {}
                    },
                    "node_ids": {
                        "default": []
                    },
                    "node_instance_ids": {
                        "default": []
                    },
                    "run_by_dependency_order": {
                        "default": false
                    },
                    "operation": {},
                    "type_names": {
                        "default": []
                    }
                }
            }, {
                "created_at": null,
                "name": "install",
                "parameters": {}
            }, {
                "created_at": null,
                "name": "uninstall",
                "parameters": {}
            }],
            "id": "deployment1"
        }]
    };

    var _error = {
        "message": "Required input 'image_name' was not specified - expected inputs: [u'webserver_port', u'image_name', u'flavor_name', u'agent_user']",
        "error_code": "missing_required_deployment_input_error"
    };

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();

            CloudifyService.blueprints.deploy = function(params) {
                var deferred = $q.defer();

                deferred.resolve(params.inputs.image_name === undefined ? _error : _deployment);

                return deferred.promise;
            };

            scope.redirectToDeployment = function(deployment_id, blueprintId) {};

            DeployDialogCtrl = $controller('DeployDialogCtrl', {
                $scope: scope,
                CloudifyService: CloudifyService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {
        beforeEach(function() {
            scope.inputs = {
                "webserver_port": 8080,
                "image_name": "image_name",
                "agent_user": "agent_user",
                "flavor_name": "flavor_name",
                "bool_variable": false,
                "str_variable": "some string"
            };
        });

        it('should create a controller', function () {
            expect(DeployDialogCtrl).not.toBeUndefined();
        });

        it('should disable blueprint deploy option if deployment name is not provided', function() {
            scope.selectedBlueprint = _blueprint;
            scope.deployment_id = null;
            scope.inputs = _deployment.inputs;

            expect(scope.isDeployEnabled()).toBe(false);
        });

        it('should enable blueprint deploy option if deployment name is provided', function() {
            scope.selectedBlueprint = _blueprint;
            scope.deployment_id = 'deployment1';
            scope.inputs = _deployment.inputs;

            expect(scope.isDeployEnabled()).toBe(true);
        });

        it('should pass all params provided to CloudifyService on deployment creation', function() {
            spyOn(scope, 'redirectToDeployment').andCallThrough();

            scope.deployBlueprint('blueprint1');
            scope.$apply();

            waitsFor(function() {
                return scope.inProcess === false;
            });
            runs(function() {
                expect(scope.redirectToDeployment).toHaveBeenCalledWith('deployment1');
            });
        });

        it('should update input JSON object when one of the inputs is updated', function() {
            scope.inputs['image_name'] = "new value";
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(JSON.parse(scope.rawString)['image_name']).toBe('new value');
        });

        it('should save input type when converting inputs to JSON', function() {
            scope.selectedBlueprint = _blueprint;
            scope.rawString = JSON.stringify(scope.inputs, null, 2);
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(typeof(JSON.parse(scope.rawString)['webserver_port'])).toBe('number');
            expect(typeof(JSON.parse(scope.rawString)['bool_variable'])).toBe('boolean');
            expect(typeof(JSON.parse(scope.rawString)['str_variable'])).toBe('string');
        });

        it('should not validate deployment name', function() {
            scope.deployment_id = '~~~!!!@@@';
            scope.inputsState = 'raw';
            spyOn(scope, 'redirectToDeployment').andCallThrough();

            scope.deployBlueprint('blueprint1');

            waitsFor(function() {
                return scope.inProcess === false;
            });
            runs(function() {
                expect(scope.redirectToDeployment).toHaveBeenCalledWith(scope.deployment_id);
            });
        });
    });
});
