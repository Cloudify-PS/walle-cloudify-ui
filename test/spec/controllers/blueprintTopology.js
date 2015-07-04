'use strict';

xdescribe('Controller: BlueprintTopologyCtrl', function () {

    var BlueprintTopologyCtrl, scope;

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

        describe('#showNode', function(){
            it('should update scope with node and type', function() {
                var node = {'name' : 'foo'};
                scope.showNode( node );
                expect( node.nodeType).toBe('node');
                expect(scope.page.viewNode.name).toBe('foo');
            });
        });

        describe('#showRelationship', function(){
            it('should update scope with node and type', function() {
                var node = {'name' : 'foo'};
                scope.showNode( node );
                expect( node.nodeType).toBe('relationship');
                expect(scope.page.viewNode.name).toBe('foo');
            });
        });
    });
});
