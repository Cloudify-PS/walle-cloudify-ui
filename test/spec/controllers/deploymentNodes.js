'use strict';

// TODO: copy paste of BlueprintNodesCtrl
describe('Controller: DeploymentNodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var DeploymentNodesCtrl, scope;
    var _cloudifyClient,_NodeService;

    var initCtrl = inject(function($controller){
        DeploymentNodesCtrl = $controller('DeploymentNodesCtrl', {
            $scope: scope
        });
    });

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope ,cloudifyClient ,NodeService ) {
        _cloudifyClient = cloudifyClient;
        _NodeService = NodeService;
        scope = $rootScope.$new();
        spyOn(cloudifyClient.nodes, 'list').andReturn(window.mockPromise({data: {items: []}})); //default implementation can be override
        spyOn(NodeService, 'createNodesTree').andCallFake(function(){});
        initCtrl();
    }));

    it('should create a controller', function () {
        expect(DeploymentNodesCtrl).not.toBeUndefined();
    });

    describe('initial load', function(){
        it('should load deployment"s nodes', function(){
            var nodesMock = [
                {
                    blueprint_id: 'bomber',
                    deploy_number_of_instances: '1',
                    deployment_id: 'bombera',
                    host_id: null,
                    id: 'bomber',
                    number_of_instances: '1'
                }
            ];
            _cloudifyClient.nodes.list.andReturn(window.mockPromise({data: {items: nodesMock}}));
            initCtrl();
            expect(scope.dataTable).toBe(nodesMock);
            expect(_NodeService.createNodesTree).toHaveBeenCalled();
        });
    });

    describe('#getRelationshipByType', function(){
        it('should get relationships by type', function(){
            expect(scope.getRelationshipByType( {relationships: [ { type_hierarchy : [ 'foo' ] }, { type_hierarchy : [ 'bar' ] } ]}, 'foo').length).toBe(1);
        });

        it('should return empty array if node has no relationships', function(){
            expect(scope.getRelationshipByType({}, 'foo').length).toBe(0);
        });
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
