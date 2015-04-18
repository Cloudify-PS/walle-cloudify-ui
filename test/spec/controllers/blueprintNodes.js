'use strict';

describe('Controller: BlueprintNodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    var DeploymentNodesCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        DeploymentNodesCtrl = $controller('BlueprintNodesCtrl', {
            $scope: scope
        });
    }));

    it('should create a controller', function () {
        expect(DeploymentNodesCtrl).not.toBeUndefined();
    });

    describe('#getRelationshipByType', function(){
        it('should get relationships by type', function(){
            expect(scope.getRelationshipByType( {relationships: [ { type_hierarchy : [ 'foo' ] }, { type_hierarchy : [ 'bar' ] } ]}, 'foo').length).toBe(1);
        });

        it('should return empty array if node has no relationships', function(){
            expect(scope.getRelationshipByType({}, 'foo').length).toBe(0);
        });
    });

    describe('#blueprintDataHandler', function(){
        it('it should listen on blueprintData event', inject(function( NodeService, $rootScope ){
            spyOn(NodeService,'createNodesTree');
            $rootScope.$broadcast('blueprintData', { plan : { nodes : 'foo' }});

            expect(NodeService.createNodesTree).toHaveBeenCalled();
            expect(scope.dataTable).toBe('foo');
        }));
    });


    describe('#getNodeById', function(){
        it('should find node in list', function(){
            scope.dataTable = [ { 'id' : 'foo' } ];
            expect(scope.getNodeById('foo').id).toBe('foo');
        });

        it('should return empty object if id not found', function(){
            scope.dataTable = [ { 'id' : 'bar' } ];
            expect(JSON.stringify(scope.getNodeById('foo'))).toBe('{}');
        });

    });

    describe('#viewNode', function(){
        it('should put node on page', function(){
            scope.viewNode('foo');
            expect(scope.page.viewNodeDetails).toBe('foo');
        });
    });

});
