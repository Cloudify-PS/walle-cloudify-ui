'use strict';

/*jshint camelcase: false */
describe('Controller: DeleteDialogCtrl', function () {
    var DeleteDialogCtrl, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    beforeEach(inject(function ($controller, $rootScope, CloudifyService) {

        spyOn(CloudifyService.blueprints, 'delete').andReturn({
            then: function () {
            }
        });
        spyOn(CloudifyService.deployments, 'deleteDeploymentById').andReturn({
            then: function () {
            }
        });

        scope = $rootScope.$new();
        DeleteDialogCtrl = $controller('DeleteDialogCtrl', {
            $scope: scope
        });
    }));

    describe('Controller tests', function () {

        it('should create a controller', function () {
            expect(DeleteDialogCtrl).not.toBeUndefined();
        });

        it('should call blueprint delete method if a blueprint is being deleted', inject(function (CloudifyService, DELETE_TYPES) {
            scope.deleteState = {itemToDelete: {'id': 'foo'}, type: DELETE_TYPES.BLUEPRINT};
            scope.confirmDelete();
            expect(CloudifyService.blueprints.delete).toHaveBeenCalledWith({id: 'foo'});
        }));

        it('should call deployment delete method if a deployment is being deleted', inject(function (CloudifyService, DELETE_TYPES) {
            scope.deleteState = {itemToDelete: {'id': 'foo'}, type: DELETE_TYPES.DEPLOYMENT};
            scope.ignoreLiveNodes = true;
            scope.confirmDelete();
            expect(CloudifyService.deployments.deleteDeploymentById).toHaveBeenCalledWith({
                deployment_id: 'foo',
                ignoreLiveNodes: true
            });
        }));


        it('should close dialog when pressing the cancel button', inject(function (ngDialog, $timeout) {
            var id = ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: scope,
                className: 'delete-dialog'
            }).id;
            $timeout.flush();
            var elemsQuery = '#' + id + ' #cancelBtnDelDep[ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);
            expect(elems.length).toBe(1);

            $('#'+id).remove(); // https://github.com/likeastore/ngDialog/issues/263
            ngDialog.closeAll();

            elems = $(elemsQuery);
            expect(elems.length).toBe(0);
        }));


        describe('#delete blueprint handler', function () {
            beforeEach(inject(function (CloudifyService) {

                CloudifyService.blueprints.delete.andCallFake(function (opts) {
                    return {
                        then: function (success, error) {
                            if (opts.id === 'fail') {
                                error({data: {}});
                            } else if (opts.id === 'fail_with_message') {
                                error({data: {message: 'foo'}});
                            } else if (opts.id === 'success') {
                                success({});
                            } else if (opts.id === 'success_with_error_code') {
                                success({error_code: 'bar', message: 'foo'});
                            }
                        }
                    };
                });

            }));

            describe('success handling', function () {
                beforeEach(inject(function (DELETE_TYPES) {
                    scope.deleteState = {inProcess: true, itemToDelete: {id: 'success'}, type: DELETE_TYPES.BLUEPRINT};
                    scope.onDelete = jasmine.createSpy('onDelete');
                }));

                it('should call `closeThisDialog`', function () {
                    scope.closeThisDialog = jasmine.createSpy('closeThisDialog');
                    scope.confirmDelete();
                    expect(scope.closeThisDialog).toHaveBeenCalled();
                    expect(scope.onDelete).toHaveBeenCalled();
                    expect(scope.deleteState.inProcess).toBe(false);
                });

                it('should put error message on scope if error_code present', function () {
                    scope.deleteState.itemToDelete.id = 'success_with_error_code';
                    scope.confirmDelete();
                    expect(scope.deleteState.inProcess).toBe(false);
                    expect(scope.deleteState.errorMessage).toBe('foo');
                });
            });


            describe('error handling', function () {
                beforeEach(inject(function (DELETE_TYPES) {
                    scope.deleteState = {inProcess: true, itemToDelete: {id: 'fail'}, type: DELETE_TYPES.BLUEPRINT};
                }));
                it('should put false on inProcess', function () {
                    scope.confirmDelete();
                    expect(scope.deleteState.inProcess).toBe(false);
                });
                it('should put a general error if non is present', function () {
                    scope.confirmDelete();
                    expect(scope.deleteState.errorMessage).toBe('An error occurred'); // todo, this should be translated.
                });
                it('should put message on scope if one exists', function () {
                    scope.deleteState.itemToDelete.id = 'fail_with_message';
                    scope.confirmDelete();
                    expect(scope.deleteState.errorMessage).toBe('foo');
                });
            });

        });

        describe('#delete deployment handler', function () {
            beforeEach(inject(function (CloudifyService) {

                CloudifyService.deployments.deleteDeploymentById.andCallFake(function (opts) {
                    return {
                        then: function (success, error) {
                            if (opts.deployment_id === 'fail') {
                                error({data: {}});
                            } else if (opts.deployment_id === 'fail_with_message') {
                                error({data: {message: 'foo'}});
                            } else if (opts.deployment_id === 'success') {
                                success({});
                            } else if (opts.deployment_id === 'success_with_error_code') {
                                success({error_code: 'bar', message: 'foo'});
                            }
                        }
                    };
                });

            }));

            describe('success handling', function () {
                beforeEach(inject(function (DELETE_TYPES) {
                    scope.deleteState = {inProcess: true, itemToDelete: {id: 'success'}, type: DELETE_TYPES.DEPLOYMENT};
                    scope.onDelete = jasmine.createSpy('onDelete');
                }));

                it('should call `closeThisDialog`', function () {
                    scope.closeThisDialog = jasmine.createSpy('closeThisDialog');
                    scope.confirmDelete();
                    expect(scope.closeThisDialog).toHaveBeenCalled();
                    expect(scope.onDelete).toHaveBeenCalled();
                    expect(scope.deleteState.inProcess).toBe(false);
                });

                it('should put error message on scope if error_code present', function () {
                    scope.deleteState.itemToDelete.id = 'success_with_error_code';
                    scope.confirmDelete();
                    expect(scope.deleteState.inProcess).toBe(false);
                    expect(scope.deleteState.errorMessage).toBe('foo');
                });
            });


            describe('error handling', function () {
                beforeEach(inject(function (DELETE_TYPES) {
                    scope.deleteState = {inProcess: true, itemToDelete: {id: 'fail'}, type: DELETE_TYPES.DEPLOYMENT};
                }));
                it('should put false on inProcess', function () {
                    scope.confirmDelete();
                    expect(scope.deleteState.inProcess).toBe(false);
                });
                it('should put a general error if non is present', function () {
                    scope.confirmDelete();
                    expect(scope.deleteState.errorMessage).toBe('An error occurred'); // todo, this should be translated.
                });
                it('should put message on scope if one exists', function () {
                    scope.deleteState.itemToDelete.id = 'fail_with_message';
                    scope.confirmDelete();
                    expect(scope.deleteState.errorMessage).toBe('foo');
                });
            });
        });

    });
});
