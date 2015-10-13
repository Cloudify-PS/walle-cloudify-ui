'use strict';

describe('Controller: NewTopologyCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp'));

    var BlueprintNewTopologyCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BlueprintNewTopologyCtrl = $controller('BlueprintNewTopologyCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', inject(function () {
        expect(scope.awesomeThings.length).toBe(3);
    }));
});
