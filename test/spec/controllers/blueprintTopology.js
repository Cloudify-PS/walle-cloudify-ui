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
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    beforeEach(function () {
        inject(function ($controller, $rootScope) {

            scope = $rootScope.$new();

            BlueprintTopologyCtrl = $controller('BlueprintTopologyCtrl', {
                $scope: scope
            });
        });
    });


    describe('toggleChange handler', function(){
        it('should change toggleBar on scope', inject(function( $rootScope ){
            $rootScope.$broadcast('toggleChange', 'foo');
            expect(scope.toggleBar).toBe('foo');
        }));
    });

    describe('blueprintData event handler', function(){
        it('should put plan nodes on scope', inject(function($rootScope, NodeService, blueprintCoordinateService){
            spyOn(NodeService,'createNodesTree');
            spyOn(blueprintCoordinateService,'resetCoordinates');
            spyOn(blueprintCoordinateService,'getCoordinates');
            spyOn(blueprintCoordinateService,'setMap');
            $rootScope.$broadcast('blueprintData', { 'plan' : { 'nodes' : [{ 'id' : 'foo'}] } });
            expect(scope.planNodes[0].id).toBe('foo');

        }));
    });

    // TODO: this is a copy paste from blueprintNodes
    describe('#getRelationshipByType', function(){
        it('should get relationships by type', function(){
            expect(scope.getRelationshipByType( {relationships: [ { type_hierarchy : [ 'foo' ] }, { type_hierarchy : [ 'bar' ] } ]}, 'foo').length).toBe(1);
        });

        it('should return empty array if node has no relationships', function(){
            expect(scope.getRelationshipByType({}, 'foo').length).toBe(0);
        });
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
