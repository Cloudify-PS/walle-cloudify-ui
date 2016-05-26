'use strict';

describe('Controller: UpdateDeploymentDialogCtrl', function () {
    // load the controller's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var UpdateDeploymentDialogCtrl,
      scope, cloudifyClient, ngProgress;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _cloudifyClient_, _ngProgress_) {
        scope = $rootScope.$new();
        scope.$parent.deployment = {id: 'dep1'};
        cloudifyClient = _cloudifyClient_;
        ngProgress = _ngProgress_;
        spyOn(cloudifyClient.deploymentUpdates, 'update').and.returnValue(window.mockPromise({}));
        spyOn(ngProgress, 'start').and.callThrough();
        spyOn(ngProgress, 'reset').and.callThrough();
        scope.closeThisDialog = function(){};
        spyOn(scope, 'closeThisDialog').and.callThrough();
    }));

    var init = inject(function($controller){
        UpdateDeploymentDialogCtrl = $controller('UpdateDeploymentDialogCtrl', {
            $scope: scope
        });
    });

    it('should check update is enabled', function(){
        init();
        scope.isCustomWorkflow = false;
        expect(scope.isUpdateEnabled()).toBe(false);
        scope.archive = 'http://archive';
        expect(scope.isUpdateEnabled()).toBe(true);

        scope.isCustomWorkflow = true;
        expect(scope.isUpdateEnabled()).toBe(false);
        scope.workflowId = 'update';
        expect(scope.isUpdateEnabled()).toBe(true);
        scope.archive = undefined;
        expect(scope.isUpdateEnabled()).toBe(false);
    });

    it('should update deployment', function(){
        init();
        scope.isCustomWorkflow = true;
        scope.archive = 'http://archive';
        scope.inputs = 'inputs';
        scope.fileName = 'file name';
        scope.workflowId = 'update';
        scope.updateDeployment();
        expect(cloudifyClient.deploymentUpdates.update).toHaveBeenCalledWith('dep1', 'http://archive', 'inputs', 'file name', {workflowId: 'update'});
        expect(ngProgress.start).toHaveBeenCalled();
        expect(ngProgress.reset).toHaveBeenCalled();
        expect(scope.closeThisDialog).toHaveBeenCalled();
        //reset spy calls
        ngProgress.start.calls.reset();
        ngProgress.reset.calls.reset();
        scope.closeThisDialog.calls.reset();

        cloudifyClient.deploymentUpdates.update.and.returnValue(window.mockPromise(null,{data:{message:'error'}}));
        scope.isCustomWorkflow = false;
        scope.installAdded = true;
        scope.uninstallRemoved = false;
        scope.updateDeployment();
        expect(cloudifyClient.deploymentUpdates.update).toHaveBeenCalledWith('dep1', 'http://archive', 'inputs', 'file name', {skipInstall: false, skipUninstall: true});
        expect(scope.updateError).toBe('error');
        expect(ngProgress.start).toHaveBeenCalled();
        expect(ngProgress.reset).toHaveBeenCalled();
        expect(scope.closeThisDialog).not.toHaveBeenCalled();
    });
});
