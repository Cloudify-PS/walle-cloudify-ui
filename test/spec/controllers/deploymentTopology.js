'use strict';

describe('Controller: DeploymentTopologyCtrl', function () {
    var DeploymentTopologyCtrl, scope;


    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock','templates-main'));

    beforeEach(inject(function ($controller, $rootScope, cloudifyClient) {
        scope = $rootScope.$new();
        spyOn(cloudifyClient.deployments, 'get').and.returnValue(window.mockPromise({ data : { blueprint_id : 'foo' } }));
        //mocking deploymentEvents interface
        scope.setShowEventsWidget = function(){};
        DeploymentTopologyCtrl = $controller('DeploymentTopologyCtrl', {
            $scope: scope
        });
    }));

    describe('Controller tests', function () {
        it('should create a controller', function () {
            expect(DeploymentTopologyCtrl).not.toBeUndefined();
        });

        it('should call cloudifyClient deployments get and put blueprint_id on scope', inject(function( cloudifyClient ){
            expect( cloudifyClient.deployments.get).toHaveBeenCalled();
            expect(scope.blueprintId).toBe('foo');
        }));


        // depreacted. to be removed in 3.4
        //describe('#showNode', function () {
        //    it('should update scope with node and type', function () {
        //        var node = {'name': 'foo'};
        //        scope.showNode(node);
        //        expect(node.nodeType).toBe('node');
        //        expect(scope.page.viewNode.name).toBe('foo');
        //    });
        //});
        //
        //describe('#showRelationship', function () {
        //    it('should update scope with node and type', function () {
        //        var node = {'name': 'foo'};
        //        scope.showRelationship(node);
        //        expect(node.nodeType).toBe('relationship');
        //        expect(scope.page.viewNode.name).toBe('foo');
        //    });
        //});
    });
});
