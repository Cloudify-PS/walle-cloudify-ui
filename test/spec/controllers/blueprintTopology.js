'use strict';

describe('Controller: BlueprintTopologyCtrl', function () {

    var BlueprintTopologyCtrl;
    var scope;

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

    it('should create a controller', function () {
        expect(BlueprintTopologyCtrl).not.toBeUndefined();
    });

    describe('#showNode', function () {
        it('should update scope with node and type', function () {
            var node = {'name': 'foo'};
            scope.onNodeSelect(node);
            expect(node.nodeType).toBe('node');
            expect(scope.page.viewNode.name).toBe('foo');
        });
    });

    describe('#showRelationship', function () {
        it('should update scope with node and type', function () {
            var node = {'name': 'foo'};
            scope.onRelationshipSelect(node);
            expect(node.nodeType).toBe('relationship');
            expect(scope.page.viewNode.name).toBe('foo');
        });
    });
});
