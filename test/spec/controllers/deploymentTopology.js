'use strict';

xdescribe('Controller: DeploymentTopologyCtrl', function () {
    var DeploymentTopologyCtrl, scope;


    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock'));

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

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(DeploymentTopologyCtrl).not.toBeUndefined();
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
