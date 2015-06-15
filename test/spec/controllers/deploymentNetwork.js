'use strict';

describe('Controller: DeploymentNetworkCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var DeploymentnetworkCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        DeploymentnetworkCtrl = $controller('DeploymentNetworkCtrl', {
            $scope: scope
        });
    }));

    // TODO: this is a copy paste from blueprintNetwork test.. obviously this code should be the same.
    it('should have a blueprintData handler that paints after some timeout', inject(function ($rootScope, CloudifyService, $timeout, NetworksService, bpNetworkService) {
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

        spyOn(bpNetworkService, 'getCoordinates').andCallFake(function () {
            return 'foo';
        });

        $rootScope.$broadcast('nodesList', {plan: {nodes: {}}});


        expect(CloudifyService.getProviderContext).toHaveBeenCalled();
        expect(NetworksService.createNetworkTree).toHaveBeenCalled();
        expect(bpNetworkService.setMap).toHaveBeenCalled();

        $timeout.flush();

        expect(scope.networkcoords).toBe('foo');

    }));

    it('put viewNode on page', function () {
        scope.viewNodeDetails('foo');
        expect(scope.page.viewNode).toBe('foo');
    });
});
