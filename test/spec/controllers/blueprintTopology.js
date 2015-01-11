'use strict';

describe('Controller: BlueprintTopologyCtrl', function () {

    var BlueprintTopologyCtrl, scope;
    var _node = {
        'relationships': [{
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_floating_ip'],
            'target_id': 'virtual_ip',
            'state': 'reachable',
            'base': 'connected',
            'type': 'cloudify.openstack.server_connected_to_floating_ip',
            'properties': {
                'connection_type': 'all_to_all'
            },
            'nodeType': 'relationship'
        }, {
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_security_group'],
            'target_id': 'security_group',
            'state': 'reachable',
            'base': 'connected',
            'type': 'cloudify.openstack.server_connected_to_security_group',
            'properties': {
                'connection_type': 'all_to_all'
            }
        }],
        'declared_type': 'vm_host',
        'name': 'nodejs_vm',
        'id': 'nodejs_vm'
    };

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            scope = $rootScope.$new();

            BlueprintTopologyCtrl = $controller('BlueprintTopologyCtrl', {
                $scope: scope
            });
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(BlueprintTopologyCtrl).not.toBeUndefined();
        });

        it('should update page object on topologyNodeSelected event broadcast', function() {
            scope.$emit('topologyNodeSelected', _node);

            waitsFor(function() {
                return scope.page.viewNode !== undefined;
            });
            runs(function() {
                expect(scope.page.viewNode).toBe(_node);
            });
        });

        it('should update page object on topologyRelationshipSelected event broadcast', function() {
            scope.$emit('topologyRelationshipSelected', _node);

            waitsFor(function() {
                return scope.page.viewNode !== undefined;
            });
            runs(function() {
                expect(scope.page.viewNode).toBe(_node);
            });
        });
    });
});
