'use strict';

describe('Controller: BlueprintNetwork', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var BlueprintNetworkCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BlueprintNetworkCtrl = $controller('BlueprintNetworkCtrl', {
            $scope: scope
        });
    }));

    it('should have a blueprintData handler', inject(function ($rootScope, CloudifyService, NetworksService, bpNetworkService) {
        spyOn(CloudifyService, 'getProviderContext').andCallFake(function () {
            return {
                then: function (success) {
                    success();
                }
            };
        });
        spyOn(NetworksService, 'createNetworkTree').andCallFake(function () {
            return {};
        });
        spyOn(bpNetworkService, 'setMap').andCallFake(function () {
        });

        $rootScope.$broadcast('blueprintData', {plan: {nodes: {}}});


        expect(CloudifyService.getProviderContext).toHaveBeenCalled();
        expect(NetworksService.createNetworkTree).toHaveBeenCalled();
        expect(bpNetworkService.setMap).toHaveBeenCalled();

    }));

    it('put viewNode on page', function () {
        scope.viewNodeDetails('foo');
        expect(scope.page.viewNode).toBe('foo');
    });
});
