'use strict';

describe('Controller: ChangeMaintenanceModeCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'templates-main','backend-mock'));

    var ChangeMaintenanceModeCtrl, scope, MaintenanceService, cloudifyClient;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_MaintenanceService_, _cloudifyClient_, $rootScope) {
        MaintenanceService = _MaintenanceService_;
        cloudifyClient = _cloudifyClient_;
        scope = $rootScope.$new();

        spyOn(MaintenanceService,'getStatus').and.returnValue('deactivated');
        spyOn(MaintenanceService,'setStatus').and.callThrough();
        spyOn(cloudifyClient.maintenance,'activate').and.returnValue(window.mockPromise());
        spyOn(cloudifyClient.maintenance,'deactivate').and.returnValue(window.mockPromise());
        //since ngDialog isn't opening this Ctrl we inject this manually
        scope.closeThisDialog = function(){};
        spyOn(scope, 'closeThisDialog').and.callThrough();

        initCtrl();
    }));

    var initCtrl = inject(function($controller){
        ChangeMaintenanceModeCtrl = $controller('ChangeMaintenanceModeCtrl', {
            $scope: scope
        });
    });

    it('should check if maintenance mode is deactivated', function(){
        expect(scope.deactivated).toEqual(true);

        MaintenanceService.getStatus.and.returnValue(function(){
            return 'activating';
        });
        initCtrl();
        expect(scope.deactivated).toBe(false);

        MaintenanceService.getStatus.and.returnValue(function(){
            return 'activated';
        });
        initCtrl();
        expect(scope.deactivated).toBe(false);
    });

    it('should succeed activating maintenance mode', function(){
        var successResponse = {
            data: {
                status: 'activating'
            }
        };
        cloudifyClient.maintenance.activate.and.returnValue(window.mockPromise(successResponse));
        scope.changeMaintenance();

        expect(cloudifyClient.maintenance.activate).toHaveBeenCalled();
        expect(MaintenanceService.setStatus).toHaveBeenCalledWith('activating');
        expect(scope.errorMessage).toBe(undefined);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });

    it('should fail activating maintenance mode', function(){
        var failResponse = {
            data: {
                message: 'This is an error'
            }
        };
        cloudifyClient.maintenance.activate.and.returnValue(window.mockPromise(null, failResponse));
        scope.changeMaintenance();

        expect(cloudifyClient.maintenance.activate).toHaveBeenCalled();
        expect(MaintenanceService.setStatus).not.toHaveBeenCalledWith('deactivated');
        expect(scope.errorMessage).toBe('This is an error');
        expect(scope.closeThisDialog).not.toHaveBeenCalled();
    });

    it('should deactivate maintenance mode', function(){
        var successResponse = {
            data: {
                status: 'deactivated'
            }
        };
        cloudifyClient.maintenance.deactivate.and.returnValue(window.mockPromise(successResponse));
        MaintenanceService.getStatus.and.returnValue('activated');
        initCtrl();
        scope.changeMaintenance();

        expect(cloudifyClient.maintenance.deactivate).toHaveBeenCalled();
        expect(MaintenanceService.setStatus).toHaveBeenCalledWith('deactivated');
        expect(scope.errorMessage).toBe(undefined);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
