'use strict';

describe('Controller: PluginsTabCtrl', function() {

    var PluginsTabCtrl;
    var scope;
    var plan = {
        deployment_plugins_to_install: [
            {package_name: null},
            {package_name: 'diamond'}
        ],
        workflow_plugins_to_install: [
            {package_name: 'fabric'},
            {name: 'no_package_name'}
        ]
    };

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, cloudifyClient) {
        scope = $rootScope.$new();
        scope.blueprintId = 'foo';

        spyOn(cloudifyClient.blueprints, 'get').and.returnValue(window.mockPromise({data: {plan: plan}}));

        PluginsTabCtrl = $controller('PluginsTabCtrl', {
            $scope: scope,
            $stateParams: {
                deploymentId: 'bar'
            }
        });
        scope.$digest();
    }));

    it('should create a controller', inject(function(cloudifyClient) {
        expect(PluginsTabCtrl).toBeDefined();
        expect(cloudifyClient.blueprints.get).toHaveBeenCalled();
        expect(scope.plugins.length).toBe(2);
    }));

    describe('#aggregatePluginsList', function() {
        it('should form an array of plugins from blueprint plan', function() {
            expect(scope.aggregatePluginsList(plan)).toEqual([
                {package_name: 'diamond'},
                {package_name: 'fabric'}
            ]);
        });
    });

});
