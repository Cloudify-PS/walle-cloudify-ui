'use strict';

// TODO: copy paste of BlueprintNodesCtrl
describe('Controller: DeploymentNodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    var DeploymentNodesCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        DeploymentNodesCtrl = $controller('DeploymentNodesCtrl', {
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
            $rootScope.$broadcast('nodesList', { plan : { nodes : 'foo' }});

            expect(NodeService.createNodesTree).toHaveBeenCalled();
            expect(scope.dataTable.plan.nodes).toBe('foo');
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
            scope.viewNodeDetails('foo');
            expect(scope.page.viewNode).toBe('foo');
        });
    });


    // todo: legacy tests - need to remove
    it('should set default middle alignment to table when gs-table-align-top class is not used', function () {
        var table = $('<table class="gs-table"><td><tr></tr></td></table>');
        $('body').append(table);
        expect($('.gs-table > tbody  > tr > td').css('vertical-align')).toBe('middle');
        table.remove();
    });

    it('should add top alignment to table when gs-table-align-top class is used', function () {
        var table = $('<table class="gs-table gs-table-align-top"><tbody><td><tr></tr></td></tbody></table>');
        $('body').append(table);
        expect($('.gs-table-align-top > tbody  > tr > td').css('vertical-align')).toBe('top');
        table.remove();
    });
});
