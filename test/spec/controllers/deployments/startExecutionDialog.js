'use strict';

describe('Controller: StartExecutionDialogCtrl', function () {
    /*jshint camelcase: false */
    var StartExecutionDialogCtrl;
    var scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        scope.deployment = {workflows: []};
        StartExecutionDialogCtrl = $controller('StartExecutionDialogCtrl', {
            $scope: scope

        });

    }));

    it('should create a controller', function () {
        expect(StartExecutionDialogCtrl).not.toBeUndefined();
    });

    describe('#isExecuteEnabled', function () {
        it('should return true if inputsValid is true and workflow exists', function () {
            scope.inputsValid = false;
            expect(scope.isExecuteEnabled()).toBe(false);

            scope.inputsValid = true;
            expect(scope.isExecuteEnabled()).toBe(false);

            scope.workflow = 'foo';
            expect(scope.isExecuteEnabled()).toBe(true);
        });
    });

    describe('executeWorkflow', function () {
        beforeEach(function () {
            scope.workflow = {'name': 'bar'};
            scope.rawString = '{}';
        });
        it('should call cloudifyclient.executions.start', inject(function (cloudifyClient) {

            spyOn(cloudifyClient.executions, 'start').andReturn(window.mockPromise());
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(true);
            expect(cloudifyClient.executions.start).toHaveBeenCalled();
        }));

        it('should setErrorMessage on failure', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.executions, 'start').andReturn(window.mockPromise({data: {message: 'foo'}}));
            spyOn(scope, 'setErrorMessage');
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(false);
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');

        }));

        it('should close dialog on success', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.executions, 'start').andReturn(window.mockPromise({data: {}}));
            scope.closeThisDialog = jasmine.createSpy('closeThisDialog');
            scope.onBegin = jasmine.createSpy('onBegin');
            scope.executeWorkflow();
            expect(scope.closeThisDialog).toHaveBeenCalled();
            expect(scope.onBegin).toHaveBeenCalled();
        }));

        it('should put error message if success result has message property', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.executions, 'start').andReturn(window.mockPromise({data: {message: 'foo'}}));
            spyOn(scope, 'setErrorMessage');
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(false);
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');

        }));
    });

    describe('buttons', function () {
        var newConfirmDialog = null;

        beforeEach(inject(function (ngDialog, $timeout) {

            newConfirmDialog = function () {
                var dialogId = ngDialog.open({
                    template: 'views/deployment/startExecutionDialog.html',
                    controller: 'StartExecutionDialogCtrl',
                    scope: scope,
                    className: 'confirm-dialog'
                }).id;
                $timeout.flush();
                return dialogId;
            };

        }));

        it('to have 1 cancel button to closeThisDialog', function () {
            scope.workflow = {};
            var dialogId = newConfirmDialog();
            var elemsQuery = '#' + dialogId + ' .confirmationButtons [ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);
            expect(elems.length).toBe(1);
            $('#' + dialogId).remove();
            expect($(elemsQuery).length).toBe(0);
        });

    });

});
