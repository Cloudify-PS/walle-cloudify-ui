'use strict';

describe('Directive: floatingDeploymentNodePanel', function () {
    var element, scope;
    var _node = {
        "relationships": [{
            "type_hierarchy": ["cloudify.relationships.depends_on", "cloudify.relationships.connected_to", "cloudify.openstack.server_connected_to_floating_ip"],
            "target_id": "virtual_ip",
            "state": "reachable",
            "base": "connected",
            "type": "cloudify.openstack.server_connected_to_floating_ip",
            "properties": {
                "connection_type": "all_to_all"
            },
            "nodeType": "relationship"
        }],
        "declared_type": "vm_host",
        "name": "nodejs_vm",
        "type_hierarchy": ["cloudify.nodes.Root", "cloudify.nodes.Compute", "cloudify.openstack.nodes.Server", "vm-host"],
        "id": "nodejs_vm",
        "instances": {
            "deploy": 1
        },
        "host_id": "nodejs_vm",
        "type": "vm_host",
        "runtime_properties": {
            "cloudify_agent": {
                "user": "ubuntu"
            },
            "resource_id": "",
            "ip": "1.1.1.1",
            "management_network_name": "",
            "server": {
                "image": "75d47d10-fef8-473b-9dd1-fe2f7649cb41",
                "flavor": 101,
                "security_groups": ["node_cellar_security_group"]
            }
        }
    };

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($compile, $rootScope, $httpBackend) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();
            element = $compile(angular.element('<div floating-deployment-node-panel node="node" depid="deploymentId"></div>'))(scope);

            $rootScope.$apply();

            scope = element.isolateScope();
            scope.$apply();
        }));
    });

    describe('Directive tests', function() {
        beforeEach(function() {
            scope = element.isolateScope();
            scope.showProperties = undefined;
        });

        it('should create an element with nodeSelected function', function() {
            expect(typeof(scope.nodeSelected)).toBe('function');
        });

        it('should create showProperties object with runtime properties', function() {
            scope.nodeSelected(_node);

            waitsFor(function() {
                return scope.showProperties !== undefined;
            });
            runs(function() {
                expect(scope.showProperties.properties).toBeDefined();
                expect(scope.showProperties.properties.ip).toBe('1.1.1.1');
            });

        });
    });
});
