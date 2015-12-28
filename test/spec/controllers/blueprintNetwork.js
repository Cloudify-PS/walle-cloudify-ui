'use strict';

describe('Controller: BlueprintNetwork', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var BlueprintNetworkCtrl,
        cloudifyClient,
        $rootScope,
        NetworksService,
        bpNetworkService,
        $q,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _cloudifyClient_, _$q_ , _NetworksService_, _bpNetworkService_ ) {
        cloudifyClient = _cloudifyClient_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        bpNetworkService = _bpNetworkService_;
        NetworksService = _NetworksService_;

        spyOn(cloudifyClient.manager,'get_context').and.returnValue(window.mockPromise({}));
        spyOn(cloudifyClient.blueprints,'get').and.returnValue(window.mockPromise({data:{ plan: {nodes: []}}}));
        spyOn($q, 'all').and.returnValue(window.mockPromise([{},{data:'foo'}]));
        spyOn(NetworksService,'createNetworkTree').and.returnValue({});
        spyOn(bpNetworkService, 'setMap').and.returnValue({});

        scope = $rootScope.$new();
        BlueprintNetworkCtrl = $controller('BlueprintNetworkCtrl', {
            $scope: scope
        });
    }));

    it('should have a blueprintData handler', function () {

        expect(cloudifyClient.manager.get_context).toHaveBeenCalled();
        expect(NetworksService.createNetworkTree).toHaveBeenCalled();
        expect(bpNetworkService.setMap).toHaveBeenCalled();

    });

    it('put viewNode on page', function () {
        scope.viewNodeDetails('foo');
        expect(scope.page.viewNode).toBe('foo');
    });
});
