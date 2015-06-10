'use strict';

describe('Controller: DeploymentTopologyCtrl', function () {
    var DeploymentTopologyCtrl, scope;
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
    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            DeploymentTopologyCtrl = $controller('DeploymentTopologyCtrl', {
                $scope: scope
            });
        }));


    describe('selectedWorkflow', function(){
        it('should put value on scope', inject(function( $rootScope ){
            $rootScope.$broadcast('selectedWorkflow','foo');
            expect(scope.selectedWorkflow).toBe('foo');
        }));
    });

    describe('toggleChange', function( ){
        it('should put value on scope', inject(function( $rootScope){
            $rootScope.$broadcast('toggleChange','foo');
            expect(scope.toggleBar).toBe('foo');
        }));
    });

    describe('nodesList', function(){
        it('should put value on scope', inject(function( $rootScope, NodeService, blueprintCoordinateService ){
            spyOn(NodeService,'createNodesTree');
            spyOn(blueprintCoordinateService,'resetCoordinates');
            spyOn(blueprintCoordinateService,'setMap');
            spyOn(blueprintCoordinateService,'getCoordinates');
            $rootScope.$broadcast( 'nodesList', []);
            expect(scope.nodesList.length).toBe(0);
        }));
    });

    describe('deploymentExecution eventHandler', function(){
        it('should update info about execution', inject(function( $rootScope, CloudifyService ){
            spyOn(CloudifyService,'autoPull').andCallFake(function(){ return { then: function(){}};});
            $rootScope.$broadcast('deploymentExecution', { currentExecution : false , deploymentInProgress : true });

        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(DeploymentTopologyCtrl).not.toBeUndefined();
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
