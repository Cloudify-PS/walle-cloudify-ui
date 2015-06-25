'use strict';

/*jshint camelcase: false */
describe('Controller: DeletedialogCtrl', function () {
    var DeleteDialogCtrl, scope, _cloudifyService;

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
                'flavor_name': {
                },
                'agent_user': {
                },
                'image_name': {
                },
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

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    function _testSetup(type) {
        inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');
            $httpBackend.whenGET('/backend/blueprints/delete?id=blueprint1').respond(200);
            $httpBackend.whenPOST('/backend/deployments/delete').respond(200);

            scope = $rootScope.$new();
            _cloudifyService = CloudifyService;
            scope.itemToDelete = type === 'blueprint' ? _blueprint : _deployment;

            DeleteDialogCtrl = $controller('DeleteDialogCtrl', {
                $scope: scope,
                CloudifyService: _cloudifyService
            });

            scope.$digest();
        });
    }

    describe('toggle ignore live nodes', function () {
        it('should toggle value on scope', function () {
            _testSetup();
            scope.ignoreLiveNodes = true;
            scope.toggleIgnoreLiveNodes();
            expect(scope.ignoreLiveNodes).toBe(false);
            scope.toggleIgnoreLiveNodes();
            expect(scope.ignoreLiveNodes).toBe(true);
        });
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            _testSetup('blueprint');
            expect(DeleteDialogCtrl).not.toBeUndefined();
        });

        it('should call blueprint delete method if a blueprint is being deleted', function() {
            _testSetup('blueprint');

            scope.itemToDelete = _blueprint;
            spyOn(_cloudifyService.blueprints, 'delete').andCallThrough();

            scope.confirmDelete();
            scope.$apply();

            expect(_cloudifyService.blueprints.delete).toHaveBeenCalledWith({id :_blueprint.id});
        });

        it('should call deployment delete method if a deployment is being deleted', function() {
            _testSetup('deployment');
            scope.itemToDelete = _deployment;
            spyOn(_cloudifyService.deployments, 'deleteDeploymentById').andCallThrough();

            scope.confirmDelete();
            scope.$apply();

            expect(_cloudifyService.deployments.deleteDeploymentById).toHaveBeenCalledWith({deployment_id :_deployment.id, ignoreLiveNodes:false});
        });

        it('should close dialog when pressing the cancel button', inject(function(ngDialog, $timeout) {
            _testSetup();
            var id = ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: scope,
                className: 'delete-dialog'
            }).id;
            $timeout.flush();

            var elemsQuery = '#' + id + ' #cancelBtnDelDep[ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);
            expect(elems.length).toBe(1);

            elems.remove();
            ngDialog.closeAll();

            elems = $(elemsQuery);
            expect(elems.length).toBe(0);




        }));
    });
});
