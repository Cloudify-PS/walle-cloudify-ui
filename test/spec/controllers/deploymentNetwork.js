'use strict';

describe('Controller: DeploymentNetworkCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var DeploymentnetworkCtrl,
        $rootScope,
        cloudifyClient,
        $timeout,
        $q,
        NetworksService,
        bpNetworkService,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _cloudifyClient_, _$timeout_, _NetworksService_, _bpNetworkService_, _$q_) {
        $rootScope = _$rootScope_;
        cloudifyClient = _cloudifyClient_;
        $timeout = _$timeout_;
        $q = _$q_;
        NetworksService = _NetworksService_;
        bpNetworkService = _bpNetworkService_;

        spyOn(cloudifyClient.manager, 'get_context').and.returnValue(window.mockPromise({data:{}}));
        spyOn(cloudifyClient.deployments,'get').and.returnValue(window.mockPromise({data:{}}));
        spyOn(cloudifyClient.blueprints,'get').and.returnValue(window.mockPromise({data:{ plan : { nodes: [] }  }}));
        spyOn($q,'all').and.returnValue(window.mockPromise([{},{ data: {} }]));

        spyOn(NetworksService, 'createNetworkTree').and.returnValue({});
        spyOn(bpNetworkService, 'setMap').and.returnValue();
        spyOn(bpNetworkService, 'getCoordinates').and.returnValue('foo');

        scope = $rootScope.$new();

        DeploymentnetworkCtrl = $controller('DeploymentNetworkCtrl', {
            $scope: scope
        });
    }));

    // TODO: this is a copy paste from blueprintNetwork test.. obviously this code should be the same.
    it('should have a blueprintData handler that paints after some timeout', function () {
        expect(cloudifyClient.manager.get_context).toHaveBeenCalled();
        expect(NetworksService.createNetworkTree).toHaveBeenCalled();
        expect(bpNetworkService.setMap).toHaveBeenCalled();

        expect(scope.networkcoords).toBe('foo');

    });

    it('put viewNode on page', function () {
        scope.viewNodeDetails('foo');
        expect(scope.page.viewNode).toBe('foo');
    });
});
