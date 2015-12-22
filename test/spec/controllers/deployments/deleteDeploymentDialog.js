'use strict';

/*jshint camelcase: false */
describe('Controller: DeleteDeploymentDialogCtrl', function () {
    var DeleteDeploymentDialogCtrl;
    var scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    beforeEach(inject(function ($controller, $rootScope, cloudifyClient) {

        spyOn(cloudifyClient.deployments, 'delete').andReturn({
            then: function () {
            }
        });

        scope = $rootScope.$new();
        scope.onDelete = jasmine.createSpy('onDelete');
        DeleteDeploymentDialogCtrl = $controller('DeleteDeploymentDialogCtrl', {
            $scope: scope
        });
    }));

    it('should create a controller', function () {
        expect(DeleteDeploymentDialogCtrl).not.toBeUndefined();
    });

    it('should call deployment delete method if a deployment is being deleted', inject(function (cloudifyClient) {
        scope.deployment = {id: 'foo'};
        scope.confirmDelete(true);
        expect(cloudifyClient.deployments.delete).toHaveBeenCalledWith('foo', true);
    }));

    describe('test template', function () {

        var dialogId;

        beforeEach(inject(function (ngDialog, $timeout) {
            dialogId = ngDialog.open({
                template: 'views/deployment/deleteDeploymentDialog.html',
                controller: 'DeleteDeploymentDialogCtrl',
                scope: scope,
                className: 'delete-dialog'
            }).id;
            $timeout.flush();
        }));

        afterEach(inject(function (ngDialog) {
            $('#' + dialogId).remove();
            ngDialog.closeAll();
        }));

        it('should set spinner only on \'Yes\' button when pressed', function () {

            scope.confirmDelete(false);
            scope.$digest();

            expect($('[ng-click="confirmDelete()"]').attr('gs-spinner')).toEqual('true');
            expect($('[ng-click="confirmDelete(true)"]').attr('gs-spinner')).toEqual('false');

        });

        it('should set spinner only on \'Force\' button when pressed', function () {

            scope.confirmDelete(true);
            scope.$digest();

            expect($('[ng-click="confirmDelete()"]').attr('gs-spinner')).toEqual('false');
            expect($('[ng-click="confirmDelete(true)"]').attr('gs-spinner')).toEqual('true');

        });

        it('should disable all the buttons when  \'Yes\' button was pressed', function () {

            scope.confirmDelete(false);
            scope.$digest();

            expect($('[ng-click="closeThisDialog()"]').attr('disabled')).toEqual('disabled');
            expect($('[ng-click="confirmDelete()"]').attr('disabled')).toEqual('disabled');
            expect($('[ng-click="confirmDelete(true)"]').attr('disabled')).toEqual('disabled');

        });

        it('should disable all the buttons when  \'Force\' button was pressed', function () {

            scope.confirmDelete(false);
            scope.$digest();

            expect($('[ng-click="closeThisDialog()"]').attr('disabled')).toEqual('disabled');
            expect($('[ng-click="confirmDelete()"]').attr('disabled')).toEqual('disabled');
            expect($('[ng-click="confirmDelete(true)"]').attr('disabled')).toEqual('disabled');

        });

        it('should close dialog when pressing the cancel button', inject(function (ngDialog) {
            var elemsQuery = '#' + dialogId + ' #cancelBtnDelDep[ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);
            expect(elems.length).toBe(1);

            $('#' + dialogId).remove(); // https://github.com/likeastore/ngDialog/issues/263
            ngDialog.closeAll();

            elems = $(elemsQuery);
            expect(elems.length).toBe(0);
        }));
    });

    describe('#delete deployment handler', function () {
        beforeEach(inject(function (cloudifyClient) {

            cloudifyClient.deployments.delete.andCallFake(function (deployment_id) {
                return {
                    then: function (success, error) {
                        if (deployment_id === 'fail') {
                            error({data: {}});
                        } else if (deployment_id === 'fail_with_message') {
                            error({data: {message: 'foo'}});
                        } else if (deployment_id === 'success') {
                            success({data: {}});
                        } else if (deployment_id === 'success_with_error_code') {
                            success({
                                data: {
                                    error_code: 'bar',
                                    message: 'foo'
                                }
                            });
                        }
                    }
                };
            });

        }));

        describe('success handling', function () {
            beforeEach(function () {
                scope.inProcess = true;
                scope.deployment = {id: 'success'};
            });

            it('should call `closeThisDialog`', function () {
                scope.closeThisDialog = jasmine.createSpy('closeThisDialog');

                scope.confirmDelete();
                expect(scope.closeThisDialog).toHaveBeenCalled();
                expect(scope.onDelete).toHaveBeenCalled();
                expect(scope.inProcess).toBe(false);
            });

            it('should put error message on scope if error_code present', function () {
                scope.deployment = {'id': 'success_with_error_code'};
                scope.confirmDelete();
                expect(scope.inProcess).toBe(false);
                expect(scope.errorMessage).toBe('foo');
            });
        });

        describe('error handling', function () {
            beforeEach(function () {
                scope.inProcess = true;
                scope.deployment = {id: 'fail'};
            });
            it('should put false on inProcess', function () {
                scope.confirmDelete();
                expect(scope.inProcess).toBe(false);
            });
            it('should put a general error if non is present', function () {
                scope.confirmDelete();
                expect(scope.errorMessage).toBe('An error occurred'); // todo, this should be translated.
            });
            it('should put message on scope if one exists', function () {
                scope.deployment = {id: 'fail_with_message'};
                scope.confirmDelete();
                expect(scope.errorMessage).toBe('foo');
            });
        });
    });

});
