'use strict';

describe('Controller: ConfigCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var ConfigCtrl,
        mockWindow,

        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, CloudifyService) {
        mockWindow = {};
        scope = $rootScope.$new();
        spyOn(CloudifyService, 'setSettings');
        ConfigCtrl = $controller('ConfigCtrl', {
            $scope: scope,
            $window: mockWindow
        });
    }));

    describe('#saveConfiguration', function () {
        it('should call cloudify set settings', inject(function (CloudifyService) {
            scope.cosmoServer = '127.0.0.1';
            scope.cosmoPort = '80';
            scope.saveConfiguration();
            expect(CloudifyService.setSettings).toHaveBeenCalled();
        }));

        it('should not call cloudify set settings if invalid', inject(function (CloudifyService) {
            scope.saveConfiguration();
            expect(CloudifyService.setSettings).not.toHaveBeenCalled();
            expect(scope.errList.length).toBe(2);
        }));
    });
});
