'use strict';

describe('Controller: MaintenanceCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp'));

    var MaintenanceCtrl, scope ,MaintenanceService, ngDialog;
    var listenerCalled;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_MaintenanceService_, _ngDialog_, $rootScope) {
        MaintenanceService = _MaintenanceService_;
        ngDialog = _ngDialog_;
        listenerCalled = false;
        spyOn(MaintenanceService, 'onStatusChange').and.callFake(window.maintenanceMock.getOnStatusChangeMock('activating', function(){
            listenerCalled = true;
        }));
        spyOn(ngDialog, 'open').and.callThrough();
        scope = $rootScope.$new();
        initCtrl();
    }));

    var initCtrl = inject(function($controller) {
        MaintenanceCtrl = $controller('MaintenanceCtrl', {
            $scope: scope
        });
    });


    it('should listen to maintenance status changes', function(){
        expect(MaintenanceService.onStatusChange).toHaveBeenCalled();
        expect(scope.status).toBe('activating');
    });

    it('should destroy listener when scope is destroyed', function(){
        scope.$destroy();
        expect(listenerCalled).toBe(true);
    });

    it('should open maintenance dialog', function(){
        scope.openMaintenanceDialog();
        expect(ngDialog.open).toHaveBeenCalled();
    });
});
