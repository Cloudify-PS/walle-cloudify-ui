'use strict';

describe('Service: MaintenanceService', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var MaintenanceService;
    beforeEach(inject(function (_MaintenanceService_) {
        MaintenanceService = _MaintenanceService_;
    }));

    it('should handle statuses changes', function () {
        var currentStatus;
        MaintenanceService.onStatusChange(function(newStatus){
            currentStatus = newStatus;
        });

        MaintenanceService.setMaintenanceData({status: 'deactivated'});
        expect(currentStatus).toBe('deactivated');
        expect(MaintenanceService.getMaintenanceData()).toEqual({status: 'deactivated'});

        MaintenanceService.setMaintenanceData({status: 'activated'});
        expect(currentStatus).toBe('activated');
        expect(MaintenanceService.getMaintenanceData()).toEqual({status: 'activated'});
    });

});
