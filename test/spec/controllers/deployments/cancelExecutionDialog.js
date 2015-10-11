'use strict';

describe('Controller: CancelExecutionDialogCtrl', function () {
    /*jshint camelcase: false */
    var CancelExecutionDialogCtrl, scope;


    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        CancelExecutionDialogCtrl = $controller('CancelExecutionDialogCtrl', {
            $scope: scope
        });

    }));


    it('should create a controller', function () {
        expect(CancelExecutionDialogCtrl).not.toBeUndefined();
    });


    it('should cancel execution by its id', inject(function (cloudifyClient) {
        spyOn(cloudifyClient.executions,'cancel').andReturn( window.mockPromise() );
        scope.currentExecution = {'id': '123'};
        scope.cancelWorkflow();
        expect(cloudifyClient.executions.cancel).toHaveBeenCalledWith('123', false);
    }));

    it('should force cancel execution if asked for', inject(function(cloudifyClient){
        spyOn(cloudifyClient.executions,'cancel').andReturn( window.mockPromise());
        scope.currentExecution = {'id': '123'};
        scope.cancelWorkflow(true);
        expect(cloudifyClient.executions.cancel).toHaveBeenCalledWith('123', true);
    }));



    describe('cancelExecution', function(){
        it('should show error message if cancel execution fails', inject(function (cloudifyClient) {
            scope.currentExecution = {};
            // override spy
            spyOn(cloudifyClient.executions,'cancel').andCallFake(function () {
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
        it('should show error message if cancel execution returns successfully but with `error_code`', inject(function( cloudifyClient ){
            spyOn(cloudifyClient.executions,'cancel').andCallFake(function(){
                return {
                    then: function(success){
                        success({  data : { 'error_code' : {}, 'message' : 'foo'} });
                    }
                };
            });
            scope.currentExecution = {};
            spyOn(scope,'setErrorMessage');
            scope.cancelWorkflow();
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');
        }));

        it('should return if execution is not found', inject(function( cloudifyClient ){
            spyOn(cloudifyClient.executions,'cancel');
            scope.cancelWorkflow();
            expect(cloudifyClient.executions.cancel).not.toHaveBeenCalled();
        }));

    });



    describe('buttons',function(){
        var newConfirmDialog = null;


        beforeEach(inject(function(ngDialog,$timeout){

            newConfirmDialog = function (){
                var dialogId = ngDialog.open({
                    template: 'views/deployment/cancelExecutionDialog.html',
                    controller: 'CancelExecutionDialogCtrl',
                    scope: scope,
                    className: 'confirm-dialog'
                }).id;
                $timeout.flush();
                return dialogId;
            };



        }));

        it('should close dialog when pressing the cancel button', function() {
            scope.workflow = {};
            var dialogId = newConfirmDialog();
            var elemsQuery = '#' + dialogId + ' .confirmationButtons [ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);

            expect(elems.length).toBe(1);

            $('#'+dialogId).remove();

            expect($(elemsQuery).length).toBe(0);
        });

    });

});
