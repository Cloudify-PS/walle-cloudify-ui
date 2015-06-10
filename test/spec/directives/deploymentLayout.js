'use strict';

describe('Directive: deploymentLayout', function () {

    var element, scope, _cloudifyService;

    var _getNodesCalled = false;
    var _getDeploymentExecutionsCalled = false;

    var _executions = [{
        'status': 'terminated',
        'created_at': '2015-02-12 12:13:01.977384',
        'workflow_id': 'create_deployment_environment',
        'blueprint_id': 'hw1',
        'deployment_id': 'hw1dep2',
        'error': '',
        'id': 'd6447e77-2c64-4487-9c34-07d3fef7191c'
    }, {
        'status': 'terminated',
        'created_at': '2015-02-12 12:14:06.965051',
        'workflow_id': 'install',
        'blueprint_id': 'hw1',
        'deployment_id': 'hw1dep2',
        'error': '',
        'id': 'be0a1a73-db4b-4565-a857-86fee33b18b7'
    }];

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

    var _nodes = [{
        'deploy_number_of_instances': '1',
        'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.SoftwareComponent', 'cloudify.nodes.WebServer'],
        'blueprint_id': 'blueprint1',
        'host_id': 'vm',
        'plugins_to_install': null,
        'type': 'cloudify.nodes.WebServer',
        'id': 'http_web_server',
        'number_of_instances': '1',
        'deployment_id': 'deployment1',
        'planned_number_of_instances': '1'
    }, {
        'deploy_number_of_instances': '5',
        'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.Compute', 'cloudify.openstack.nodes.Server'],
        'blueprint_id': 'blueprint1',
        'host_id': 'vm',
        'type': 'cloudify.openstack.nodes.Server',
        'id': 'vm',
        'number_of_instances': '5',
        'deployment_id': 'deployment1',
        'planned_number_of_instances': '5'
    }];

    var _deploymentNodes = [{
        'runtime_properties': {},
        'node_id': 'vm',
        'state': 'started',
        'host_id': 'vm_5874f',
        'deployment_id': 'deployment1',
        'id': 'vm_75312'
    }, {
        'runtime_properties': {},
        'node_id': 'vm',
        'state': 'started',
        'host_id': 'vm_c813d',
        'deployment_id': 'deployment1',
        'id': 'vm_c370a'
    }, {
        'runtime_properties': {},
        'node_id': 'vm',
        'state': 'started',
        'host_id': 'vm_c813d',
        'deployment_id': 'deployment1',
        'id': 'vm_c813d'
    }, {
        'runtime_properties': {},
        'node_id': 'vm',
        'state': 'started',
        'host_id': 'vm_70947',
        'deployment_id': 'deployment1',
        'id': 'vm_a67a4'
    }, {
        'runtime_properties': {},
        'node_id': 'vm',
        'state': 'started',
        'host_id': 'vm_f3e59',
        'deployment_id': 'deployment1',
        'id': 'vm_0ecfe'
    }];

    function compileDirective(opts) {
        inject(function($compile, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');
            $httpBackend.whenGET('/backend/executions').respond(200);
            $httpBackend.whenGET('/backend/nodes?deployment_id=deployment1').respond(200);
            $httpBackend.whenGET('/backend/node-instances').respond(200);
            $httpBackend.whenPOST('/backend/deployments/get').respond(200);
            $httpBackend.whenPOST('/backend/deployments/nodes').respond(200);
            $httpBackend.whenPOST('/backend/nodes').respond(200);

            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div deployment-layout></div>'))(scope);

            _cloudifyService = CloudifyService;

            _cloudifyService.deployments.getDeploymentById = function() {
                var deferred = $q.defer();
                deferred.resolve(_deployment);
                return deferred.promise;
            };

            scope.$digest();
        });
    }

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    describe('Directive tests', function() {
        beforeEach(function() {
            compileDirective();
        });

        afterEach(function() {
            $('#deployment').remove();
        });

        it('should create an element with isExecuteEnabled function', function() {
            expect(typeof(element.children().scope().isExecuteEnabled)).toBe('function');
        });

        it('should define the url to blueprint topology in the breadcrumbs', function() {
            scope.$apply();

            waitsFor(function() {
                return element.children().scope().breadcrumb.length > 0;
            });
            runs(function() {
                expect(element.children().scope().breadcrumb[0].brackets.href).toBe('#/blueprint/blueprint1/topology');
            });
        });

        it('should not set a hover effect on the execute button', function() {
            var _playBtn = element.find('.deployment-play')[0];
            $('body').append('<div id="deployment">' +
                    '<div id="deployment-header">' +
                        '<div class="header-left">' +
                            '<div class="actions"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>');
            $('.actions').append(_playBtn);

            $('.deployment-play').trigger('mouseover');

            expect($('.deployment-play').css('background-image').indexOf('images/play_disabled.png')).not.toBe(-1);
        });

        it('should not call getDeploymentExecutions autopull before getNodes', inject(function($compile, $rootScope, $q, CloudifyService) {
            _getNodesCalled = false;
            _getDeploymentExecutionsCalled = false;
            var _scope = $rootScope.$new();
            spyOn(_cloudifyService.deployments, 'getDeploymentExecutions').andCallThrough();

            CloudifyService.deployments.getDeploymentExecutions = function() {
                var deferred = $q.defer();
                deferred.resolve(_executions);
                return deferred.promise;
            };

            CloudifyService.getNodes = function() {

                var deferred = $q.defer();
                _getNodesCalled = true;

                deferred.resolve(_nodes);
                return deferred.promise;
            };

            compileDirective({scope: _scope});
            scope.$apply();

            waitsFor(function() {
                return _getNodesCalled;
            });
            runs(function() {
                expect(_getDeploymentExecutionsCalled).toBe(false);
            });
        }));

        it('should check all node instances states (CFY-2368)', inject(function($compile, $rootScope, $q, CloudifyService) {
            var _scope = $rootScope.$new();
            var _nodeList;

            CloudifyService.deployments.getDeploymentExecutions = function() {
                var deferred = $q.defer();
                deferred.resolve(_executions);
                return deferred.promise;
            };

            CloudifyService.getNodes = function() {
                var deferred = $q.defer();
                deferred.resolve(_nodes);
                return deferred.promise;
            };

            CloudifyService.deployments.getDeploymentNodes = function() {
                var deferred = $q.defer();
                deferred.resolve(_deploymentNodes);
                return deferred.promise;
            };

            $rootScope.$on('nodesList', function(event, data) {
                _nodeList = data;
            });

            compileDirective({scope: _scope});

            scope.$apply();

            waitsFor(function() {
                return _nodeList;
            });
            runs(function() {
                expect(_nodeList[1].state.completed).toEqual(5);
            });
        }));
    });
});
