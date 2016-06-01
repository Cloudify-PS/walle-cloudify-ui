'use strict';

describe('Controller: MaintenanceCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp'));

    var MaintenanceCtrl, scope ,MaintenanceService, ngDialog;
    var listenerCalled, loadRemainingExecutions, cloudifyClient;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_MaintenanceService_, _ngDialog_, $rootScope, _cloudifyClient_) {
        MaintenanceService = _MaintenanceService_;
        ngDialog = _ngDialog_;
        cloudifyClient = _cloudifyClient_;
        listenerCalled = false;
        spyOn(MaintenanceService, 'onStatusChange').and.callFake(window.maintenanceMock.getOnStatusChangeMock('activating', function(){
            listenerCalled = true;
        }));
        spyOn(MaintenanceService, 'getMaintenanceData').and.returnValue(null);
        spyOn(cloudifyClient.executions, 'list').and.returnValue(window.mockPromise({data: {items: ['exec1', 'exec2', 'exec3']}}));
        spyOn(ngDialog, 'open').and.callThrough();
        scope = $rootScope.$new();
        spyOn(scope, 'registerTickerTask').and.callFake(function(id, callback){
            loadRemainingExecutions = callback;
        });
        spyOn(scope, 'unregisterTickerTask').and.callFake(function(){});
        initCtrl();
    }));

    var initCtrl = inject(function($controller) {
        MaintenanceCtrl = $controller('MaintenanceCtrl', {
            $scope: scope
        });
    });


    it('should listen to maintenance status changes', function(){
        var tickerId = 'maintenance/loadRemainingExecutions';
        expect(MaintenanceService.onStatusChange).toHaveBeenCalled();
        expect(scope.status).toBe('activating');
        expect(scope.registerTickerTask).toHaveBeenCalledWith(tickerId, loadRemainingExecutions, 1000);
        expect(scope.executionsErrorMessage).toBe(null);
        expect(scope.remainingExecutions).toBe(null);
        expect(scope.loadingExecutions).toBe(true);

        MaintenanceService.onStatusChange.and.callFake(window.maintenanceMock.getOnStatusChangeMock('activated', function(){
            listenerCalled = true;
        }));
        initCtrl();
        expect(scope.unregisterTickerTask).toHaveBeenCalledWith(tickerId);

    });

    it('should destroy listener when scope is destroyed', function(){
        scope.$destroy();
        expect(listenerCalled).toBe(true);
    });

    it('should open maintenance dialog', function(){
        scope.openMaintenanceDialog();
        expect(ngDialog.open).toHaveBeenCalled();
    });

    it('should poll remaining executions', function(){
        //no data
        loadRemainingExecutions();
        expect(MaintenanceService.getMaintenanceData).toHaveBeenCalled();
        expect(scope.loadingExecutions).toBe(false);
        expect(cloudifyClient.executions.list).not.toHaveBeenCalled();

        //no remaining executions
        MaintenanceService.getMaintenanceData.and.returnValue({status: 'activating'});
        loadRemainingExecutions();
        expect(MaintenanceService.getMaintenanceData.calls.count()).toBe(2);
        expect(scope.loadingExecutions).toBe(false);
        expect(cloudifyClient.executions.list).not.toHaveBeenCalled();

        //with executions
        //good response
        MaintenanceService.getMaintenanceData.and.returnValue({status: 'activating', remaining_executions: [{id: 'exec1'}, {id: 'exec2'}]});
        loadRemainingExecutions();
        expect(MaintenanceService.getMaintenanceData.calls.count()).toBe(3);
        expect(scope.loadingExecutions).toBe(false);
        expect(cloudifyClient.executions.list).toHaveBeenCalledWith({id: ['exec1', 'exec2']});
        expect(scope.remainingExecutions).toEqual(['exec1', 'exec2', 'exec3']);

        //bad response
        cloudifyClient.executions.list.and.returnValue(window.mockPromise(null, {message: 'executions error'}));
        loadRemainingExecutions();
        expect(scope.executionsErrorMessage).toBe('executions error');
    });

    it('should cancel execution', function(){
        var executionObject = {eden: true};
        scope.cancelExecution(executionObject);
        expect(ngDialog.open).toHaveBeenCalledWith({
            template: 'views/deployment/cancelExecutionDialog.html',
            controller: 'CancelExecutionDialogCtrl',
            scope: _.merge(scope, executionObject),
            className: 'confirm-dialog'
        });
    });
});
