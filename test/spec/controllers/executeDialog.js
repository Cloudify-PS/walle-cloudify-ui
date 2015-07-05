'use strict';

describe('Controller: ExecuteDialogCtrl', function () {
    /*jshint camelcase: false */
    var ExecuteDialogCtrl, scope;


    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, CloudifyService/*, cloudifyClient*/) {
        scope = $rootScope.$new();

        scope.getExecution = jasmine.createSpy('getExecution');

        ExecuteDialogCtrl = $controller('ExecuteDialogCtrl', {
            $scope: scope,
            CloudifyService: CloudifyService
        });

    }));

    beforeEach(inject(function (CloudifyService) {
        spyOn(CloudifyService.deployments, 'execute').andCallFake(function (executionData) {
            return {
                then: function (success, error) {

                    if (executionData.inputs === undefined || JSON.stringify(executionData.inputs) === '{}') {
                        error({});
                    } else {
                        success({});
                    }
                }
            };

        });

        scope.closeThisDialog = jasmine.createSpy('closeThisDialog');

        spyOn(CloudifyService.deployments, 'updateExecutionState').andCallFake(function (execution_id) {
            return {
                then: function (success, error) {

                    if (execution_id === 'fail' ) {
                        error({});
                    } else {
                        success(execution_id);
                    }
                }
            };
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


    it('should cancel execution by its id', inject(function (CloudifyService) {

        scope.currentExecution = {'id': '123'};
        scope.cancelWorkflow('deployment_id');

        expect(CloudifyService.deployments.updateExecutionState).toHaveBeenCalledWith({
            execution_id: '123',
            state: 'cancel'
        });
    }));

    describe('#isExecuteEnabled', function(){
        it('should return true if inputsValid is true', function(){
            scope.inputsValid = false;
            expect(scope.isExecuteEnabled()).toBe(false);

            scope.inputsValid = true;
            expect(scope.isExecuteEnabled()).toBe(true);
        });
    });

    describe('cancelExecution', function(){
        it('should show error message if cancel execution fails', inject(function (CloudifyService) {
            var executeParams = null;
            scope.currentExecution = {};
            // override spy
            CloudifyService.deployments.updateExecutionState.andCallFake(function (params) {
                executeParams = params;
                return {
                    then: function (success, error) {
                        error({'data': {'message': 'foo'}});
                    }
                };
            });

            scope.executeErrorMessage = '';

            scope.cancelWorkflow();

            expect(scope.executeErrorMessage).toBe('foo');
        }));

        // todo: find out if true across the project.. perhaps not needed since using the client
        it('should show error message if cancel execution returns successfully but with `error_code`', inject(function( CloudifyService ){
            CloudifyService.deployments.updateExecutionState.andCallFake(function(){
                return {
                    then: function(success){
                        success({'error_code' : {}, 'message' : 'foo'});
                    }
                };
            });
            scope.currentExecution = {};
            spyOn(scope,'setErrorMessage');
            scope.cancelWorkflow();
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');
        }));

        it('should return if execution is not found', inject(function( CloudifyService ){
            scope.getExecution.andReturn(null);
            scope.cancelWorkflow();
            expect(CloudifyService.deployments.updateExecutionState).not.toHaveBeenCalled();
        }));

    });

    describe('executeWorkflow', function(){
        beforeEach(function(){
            scope.workflow = { 'name': 'bar'};
            scope.rawString = '{}';
        });
        it('should call CloudifyService.deployments.execute', inject(function( CloudifyService ){

            CloudifyService.deployments.execute.andReturn({ then:function(){}});
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(true);
            expect(CloudifyService.deployments.execute).toHaveBeenCalled();
        }));

        it('should setErrorMessage on failure', inject(function(CloudifyService){
            CloudifyService.deployments.execute.andReturn({ then:function( success, error ){
                error({data: {message:'foo'}});
            }});
            spyOn(scope,'setErrorMessage');
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(false);
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');

        }));

        it('should close dialog on success', inject(function(CloudifyService){
            CloudifyService.deployments.execute.andReturn({ then:function( success ){
                success({});
            }});
            scope.closeThisDialog = jasmine.createSpy();
            scope.executeWorkflow();
            expect(scope.closeThisDialog).toHaveBeenCalled();
        }));

        it('should put error message if success result has message property', inject(function(CloudifyService){
            CloudifyService.deployments.execute.andReturn({ then:function( success ){
                success({ message : 'foo'});
            }});
            spyOn(scope,'setErrorMessage');
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(false);
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');


        }));
    });

    describe('cancel button', function(){
        it('should close dialog when pressing the cancel button', inject(function (ngDialog, $timeout) {
            scope.workflow = {};
            var id = ngDialog.open({
                template: 'views/dialogs/executeDialog.html',
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




});
