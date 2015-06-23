'use strict';

/*jshint camelcase: false */
describe('Controller: DeploydialogCtrl', function () {
    var DeployDialogCtrl, scope;
    var _deployment = {
        'inputs': {
            'webserver_port': 8080,
            'image_name': 'image_name',
            'agent_user': 'agent_user',
            'flavor_name': 'flavor_name'
        },
        'blueprint_id': 'blueprint1',
        'id': 'deployment1',
        'outputs': {
            'http_endpoint': {
                'description': 'HTTP web server endpoint.',
                'value': {
                    'get_attribute': ['vm', 'ip']
                }
            }
        }
    };

    var _blueprint = {
        'id': 'blueprint1',
        'plan': {
            'inputs': {
                'webserver_port': {
                    'default': 8080
                },
                'flavor_name': {},
                'agent_user': {},
                'image_name': {},
                'bool_variable': {
                    'default': false
                },
                'str_variable': {
                    'default': 'some string'
                }
            },
            'workflows': {
                'execute_operation': {
                    'operation': 'cloudify.plugins.workflows.execute_operation',
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
                    },
                    'plugin': 'default_workflows'
                },
                'install': {
                    'operation': 'cloudify.plugins.workflows.install',
                    'plugin': 'default_workflows'
                },
                'uninstall': {
                    'operation': 'cloudify.plugins.workflows.uninstall',
                    'plugin': 'default_workflows'
                }
            }
        },
        'deployments': [{
            'inputs': {
                'flavor_name': 'flavor_name',
                'webserver_port': 8080,
                'image_name': 'image_name',
                'agent_user': 'agent_user'
            },
            'blueprint_id': 'blueprint1',
            'created_at': '2014-11-10 23:15:06.908209',
            'workflows': [{
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
            }, {
                'created_at': null,
                'name': 'install',
                'parameters': {}
            }, {
                'created_at': null,
                'name': 'uninstall',
                'parameters': {}
            }],
            'id': 'deployment1'
        }]
    };

    var errType = '';
    var _errors = {
        'missingInputs': {
            'message': 'Required input \'image_name\' was not specified - expected inputs: [u\'webserver_port\', u\'image_name\', u\'flavor_name\', u\'agent_user\']',
            'error_code': 'missing_required_deployment_input_error'
        },
        'depName': {
            'message': 'Error browsing blueprint files',
            'errCode': 'browseError'
        }
    };

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope, $q, CloudifyService) {
        scope = $rootScope.$new();

        CloudifyService.blueprints.deploy = function () {
            var result;
            if (errType !== '') {
                result = _errors[errType];
            } else {
                result = _deployment;
            }

            return { then : function( success/*, error*/ ){
                success(result);
            }};

        };

        scope.redirectToDeployment = function () {
        };

        spyOn(scope, 'redirectToDeployment').andCallThrough();

        DeployDialogCtrl = $controller('DeployDialogCtrl', {
            $scope: scope,
            CloudifyService: CloudifyService
        });
    }));

    describe('Controller tests', function () {
        beforeEach(function () {
            scope.inputs = {
                'webserver_port': 8080,
                'image_name': 'image_name',
                'agent_user': 'agent_user',
                'flavor_name': 'flavor_name',
                'bool_variable': false,
                'str_variable': 'some string'
            };

            scope.rawString = JSON.stringify(scope.inputs);

            scope.selectedBlueprint =  { plan : {} };
        });

        it('should create a controller', function () {
            expect(DeployDialogCtrl).not.toBeUndefined();
        });

        it('should disable blueprint deploy option if deployment name is not provided', function () {
            scope.selectedBlueprint = _blueprint;
            scope.deployment_id = null;

            expect(scope.isDeployEnabled()).toBe(false);
        });

        it('should enable blueprint deploy option if deployment name is provided', function () {
            scope.selectedBlueprint = _blueprint;
            scope.deployment_id = 'deployment1';

            expect(scope.isDeployEnabled()).toBe(true);
        });

        it('should pass all params provided to CloudifyService on deployment creation', inject(function (CloudifyService) {
            var deployParams = null;
            spyOn(CloudifyService.blueprints, 'deploy').andCallFake(function (params) {
                deployParams = params;
                return {
                    then: function() {

                    }
                };
            });

            spyOn(scope, 'isDeployEnabled').andCallFake(function () {
                return true;
            });

            scope.deployment_id = 'deployment1';
            scope.deployBlueprint('blueprint1');

            expect(deployParams).not.toBe(null);
            expect(CloudifyService.blueprints.deploy).toHaveBeenCalledWith(deployParams);
        }));

        it('should update input JSON object when one of the inputs is updated', function () {
            scope.inputs.image_name = 'new value';
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(JSON.parse(scope.rawString).image_name).toBe('new value');
        });

        it('should save input type when converting inputs to JSON', function () {
            scope.selectedBlueprint = _blueprint;
            scope.rawString = JSON.stringify(scope.inputs, null, 2);
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(typeof(JSON.parse(scope.rawString).webserver_port)).toBe('number');
            expect(typeof(JSON.parse(scope.rawString).bool_variable)).toBe('boolean');
            expect(typeof(JSON.parse(scope.rawString).str_variable)).toBe('string');
        });

        it('should not validate deployment name', inject(function (CloudifyService) {
            spyOn(CloudifyService.blueprints, 'deploy').andCallFake(function () {
                scope.inProcess = false;
                scope.redirectToDeployment(scope.deployment_id);
                return {
                    then: function() {

                    }
                };
            });

            scope.deployment_id = '~~~!!!@@@';
            scope.inputsState = 'raw';

            spyOn(scope, 'isDeployEnabled').andCallFake(function () {
                return true;
            });

            scope.deployBlueprint('blueprint1');

            expect(scope.redirectToDeployment).toHaveBeenCalledWith(scope.deployment_id);
        }));


        it('should set showError flag to true once deploy returned message', inject(function (CloudifyService) {
            spyOn(CloudifyService.blueprints, 'deploy').andCallFake(function () {
                return {
                    then: function(success/*, error*/) {
                        success({'message': 'foo'});
                    }
                };
            });

            spyOn(scope, 'isDeployEnabled').andCallFake(function () {
                return true;
            });

            scope.deployment_id = 'deployment1';
            scope.deployBlueprint('blueprint1');

            expect(scope.deployErrorMessage).toBe('foo');
            expect(scope.showError()).toBe(true);
        }));


        it('should set showError flag to false once the deployment name is changed', function () {
            scope.deployment_id = 'deployment1';
            scope.deployErrorMessage = 'hello';

            scope.deployment_id = 'deployment2';
            scope.$apply();

            expect(scope.showError()).toBe(false);
        });
    });

    describe('#isParamsVisible', function(){
        it('should return false if selectedBlueprint is null', function(){
            scope.selectedBlueprint = null;
            expect(!!scope.isParamsVisible()).toBe(false);
        });

        it('should return true if selected blueprint has inputs', function(){
            scope.selectedBlueprint = { plan : { inputs: [] }};
            expect(!!scope.isParamsVisible()).toBe(true);
        });
    });

    describe('#validateJsonKeys', function(){
        describe('non strict mode', function(){
            beforeEach(function(){
                scope.selectedBlueprint = {
                    plan: {
                        inputs: {
                            'foo' : 'bar',
                            'hello' : 'world'
                        }
                    }
                };
            });
            it('should return error and false if key is missing', function(){
                scope.rawString = JSON.stringify({'foo' : 'bar'});
                expect(scope.validateJsonKeys()).toBe(false);
                expect(scope.deployErrorMessage).toBe('Missing hello key in JSON');
            });

            it('should return true if all keys exist', function(){
                scope.rawString = JSON.stringify({'foo' : 'bar','hello' : 'world'});
                expect(scope.validateJsonKeys()).toBe(true);
                expect(scope.deployErrorMessage).toBe(null);
            });
        });

        describe('strict mode', function(){
            beforeEach(function(){
                scope.selectedBlueprint = {
                    plan: {
                        inputs: {
                            'foo' : 'bar'
                        }
                    }
                };
            });
            it('should return error and false if key is missing', function(){
                scope.rawString = JSON.stringify({'foo' : ''});
                expect(scope.validateJsonKeys(true)).toBe(false);
                expect(scope.deployErrorMessage).toBe(null);
            });

            it('should return error and false if key is missing', function(){
                scope.rawString = JSON.stringify({'foo' : null});
                expect(scope.validateJsonKeys(true)).toBe(false);
                expect(scope.deployErrorMessage).toBe(null);
            });
        });
    });

    describe('#validateJSON', function(){
        it('should return false if rawString is an invalid JSON', function(){
            scope.rawString = ' { "some" goofy } ';
            expect(scope.validateJSON(true)).toBe(false);
            expect(scope.deployErrorMessage).toBe('Invalid JSON: Unable to parse JSON string');
        });
    });

    describe('#rawToForm', function(){
        it('should stringify "1","true" and "null" and not convert them to 1,true,null', function(){
            scope.rawString = '{ "foo" : "1", "bar" : "true", "hello" : "null" }';
            scope.rawToForm();
            expect(scope.inputs.foo).toBe('"1"');
            expect(scope.inputs.bar).toBe('"true"');
            expect(scope.inputs.hello).toBe('"null"');
        });

        it('should handle invalid raw string and remain in raw mode', inject(function( INPUT_STATE ){
            scope.rawString = '{ foo bar }';
            scope.rawToForm();
            expect(scope.deployErrorMessage).toBe('Invalid JSON: Unable to parse JSON string');
            expect(scope.inputsState).toBe( INPUT_STATE.RAW );
        }));
    });
});
