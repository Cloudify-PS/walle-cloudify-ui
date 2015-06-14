'use strict';

describe('Controller: DeploymentExecutions', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock'));

    var DeploymentExecutions, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        scope = $rootScope.$new();
        DeploymentExecutions = $controller('DeploymentExecutionsCtrl', {
            $scope: scope
        });
    }));

    it('should create a controller', function () {
        expect(DeploymentExecutions).not.toBeUndefined();
    });

    it('should listen on deploymentExecution event', inject(function($rootScope){
        $rootScope.$broadcast('deploymentExecution', { 'executionsList' : 'foo' } );
        expect(scope.executionsList).toBe('foo');
    }));

});
