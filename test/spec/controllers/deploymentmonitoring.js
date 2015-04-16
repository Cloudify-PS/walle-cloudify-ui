'use strict';

describe('Controller: DeploymentmonitoringCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var DeploymentMonitoringCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        DeploymentMonitoringCtrl = $controller('DeploymentMonitoringCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.showGrafanaLoader).toBe(true);
        scope.grafanaLoad();
        expect(scope.showGrafanaLoader).toBe(false);
    });
});
