'use strict';

xdescribe('Controller: ExecuteDialogCtrl', function () {
    /*jshint camelcase: false */
    var ExecuteDialogCtrl, scope;


    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, CloudifyService/*, cloudifyClient*/) {
        scope = $rootScope.$new();

        scope.getExecution = jasmine.createSpy('getExecution');
        spyOn(CloudifyService.deployments, 'execute').andCallFake(function (executionData) {
            return {
                then: function (success, error) {

                    if (executionData.inputs === undefined || JSON.stringify(executionData.inputs) === '{}') {
                        error(_executionError);
                    } else {
                        success(_execution);
                    }
                }
            };

        });

        spyOn(CloudifyService.deployments, 'updateExecutionState').andCallFake(function (execution_id) {
            return {
                then: function (success, error) {

                    if (execution_id) {
                        error(_executionError);
                    } else {
                        success(execution_id);
                    }
                }
            };

        });

        ExecuteDialogCtrl = $controller('ExecuteDialogCtrl', {
            $scope: scope,
            CloudifyService: CloudifyService
        });

    }));

    beforeEach(function () {
        scope.inputs = {
            'webserver_port': 8080,
            'image_name': 'image_name',
            'agent_user': 'agent_user',
            'flavor_name': 'flavor_name',
            'bool_variable': false,
            'str_variable': 'some string'
        };
    });

    it('should create a controller', function () {
        expect(ExecuteDialogCtrl).not.toBeUndefined();
    });

    it('should update input JSON object when one of the parameters is updated', function () {
        scope.selectedWorkflow = _workflow;
        scope.inputs.image_name = 'new value';
        scope.inputsState = 'raw';

        scope.updateInputs();

        expect(JSON.parse(scope.rawString).image_name).toBe('new value');
    });

    it('should keep input type when converting to JSON object', function () {
        scope.selectedWorkflow = _workflow;
        scope.inputsState = 'raw';

        scope.updateInputs();

        expect(typeof(JSON.parse(scope.rawString).str_variable)).toBe('string');
        expect(typeof(JSON.parse(scope.rawString).webserver_port)).toBe('number');
        expect(typeof(JSON.parse(scope.rawString).bool_variable)).toBe('boolean');
    });

    it('should show error message if required parameters are not provided', inject(function (CloudifyService) {
        var executeParams = null;
        CloudifyService.deployments.execute.andCallFake(function (params) {
            executeParams = params;
            return {
                then: function (success, error) {
                    error({'data': {'message': 'foo'}});
                }
            };
        });

        scope.toggleConfirmationDialog = function () {
        };

        spyOn(scope, 'isExecuteEnabled').andCallFake(function () {
            return true;
        });

        scope.rawString = '{}';
        scope.inputs = {};
        scope.executeErrorMessage = '';
        scope.selectedWorkflow = {
            data: {}
        };

        scope.executeWorkflow();

        expect(scope.executeErrorMessage).toBe('foo');
        expect(scope.showError).toBe(true);
    }));

    it('should cancel execution by its id', inject(function (CloudifyService) {

        scope.getExecution.andReturn({'id': '123'});
        scope.cancelWorkflow('deployment_id');

        expect(CloudifyService.deployments.updateExecutionState).toHaveBeenCalledWith({
            execution_id: '123',
            state: 'cancel'
        });
    }));

    it('should show error message if cancel execution fails', inject(function (CloudifyService) {
        var executeParams = null;
        scope.getExecution.andReturn({});
        // override spy
        CloudifyService.deployments.updateExecutionState.andCallFake(function (params) {
            executeParams = params;
            return {
                then: function (success, error) {
                    error({'data': {'message': 'foo'}});
                }
            };
        });

        scope.toggleConfirmationDialog = function () {
        };

        spyOn(scope, 'isExecuteEnabled').andCallFake(function () {
            return true;
        });

        scope.executeErrorMessage = '';

        scope.cancelWorkflow();

        expect(scope.executeErrorMessage).toBe('foo');
        expect(scope.showError).toBe(true);
    }));

    it('should close dialog when pressing the cancel button', inject(function (ngDialog, $timeout) {
        scope.selectedWorkflow = _workflow;
        var id = ngDialog.open({
            template: 'views/dialogs/confirm.html',
            controller: 'ExecuteDialogCtrl',
            scope: scope,
            className: 'confirm-dialog'
        }).id;
        $timeout.flush();


        var elemsQuery = '#' + id + ' .confirmationButtons [ng-click="closeThisDialog()"]';
        var elems = $(elemsQuery);
        expect(elems.length).toBe(2);


        elems.remove();
        ngDialog.closeAll(); //https://github.com/likeastore/ngDialog/issues/263
        expect($(elemsQuery).length).toBe(0);
    }));

});
