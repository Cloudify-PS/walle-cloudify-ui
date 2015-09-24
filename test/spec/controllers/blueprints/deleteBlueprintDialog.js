'use strict';

/*jshint camelcase: false */
describe('Controller: DeleteBlueprintDialogCtrl', function () {
    var DeleteBlueprintDialogCtrl, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    beforeEach(inject(function ($controller, $rootScope, cloudifyClient) {

        spyOn(cloudifyClient.blueprints, 'delete').andReturn({
            then: function () {
            }
        });

        scope = $rootScope.$new();
        scope.onDelete = jasmine.createSpy('onDelete');
        scope.closeThisDialog = jasmine.createSpy('closeThisDialog');
        DeleteBlueprintDialogCtrl = $controller('DeleteBlueprintDialogCtrl', {
            $scope: scope
        });
    }));


    it('should create a controller', function () {
        expect(DeleteBlueprintDialogCtrl).not.toBeUndefined();
    });

    it('should call blueprint delete method if a blueprint is being deleted', inject(function (cloudifyClient) {
        scope.blueprint = { id : 'foo' };
        scope.confirmDelete();
        expect(cloudifyClient.blueprints.delete).toHaveBeenCalledWith('foo');
    }));


    it('should close dialog when pressing the cancel button', inject(function (ngDialog, $timeout) {
        var id = ngDialog.open({
            template: 'views/blueprint/deleteBlueprintDialog.html',
            controller: 'DeleteBlueprintDialogCtrl',
            scope: scope,
            className: 'delete-dialog'
        }).id;
        $timeout.flush();
        var elemsQuery = '#' + id + ' #cancelBtnDelDep[ng-click="closeThisDialog()"]';
        var elems = $(elemsQuery);
        expect(elems.length).toBe(1);

        $('#' + id).remove(); // https://github.com/likeastore/ngDialog/issues/263
        ngDialog.closeAll();

        elems = $(elemsQuery);
        expect(elems.length).toBe(0);
    }));


    describe('#delete blueprint handler', function () {
        beforeEach(inject(function (cloudifyClient) {

            cloudifyClient.blueprints.delete.andCallFake(function (blueprintId) {
                return {
                    then: function (success, error) {
                        if (blueprintId === 'fail') {
                            error({data: {}});
                        } else if (blueprintId === 'fail_with_message') {
                            error({data: {message: 'foo'}});
                        } else if (blueprintId === 'success') {
                            success({ data : {} });
                        } else if (blueprintId === 'success_with_error_code') {
                            success({ data : { error_code: 'bar', message: 'foo'} } );
                        }
                    }
                };
            });

        }));

        describe('success handling', function () {
            beforeEach(function () {
                scope.inProcess = true;
                scope.blueprint = { id : 'success' };
            });

            it('should call `closeThisDialog`', function () {

                scope.confirmDelete();
                expect(scope.closeThisDialog).toHaveBeenCalled();
                expect(scope.onDelete).toHaveBeenCalled();
                expect(scope.inProcess).toBe(false);
            });

            it('should put error message on scope if error_code present', function () {
                scope.blueprint = { id : 'success_with_error_code' } ;
                scope.confirmDelete();
                expect(scope.inProcess).toBe(false);
                expect(scope.errorMessage).toBe('foo');
            });
        });


        describe('error handling', function () {
            beforeEach(function () {
                scope.inProcess = true;
                scope.blueprint = {id: 'fail'};
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
                scope.blueprint = { id : 'fail_with_message' };
                scope.confirmDelete();
                expect(scope.errorMessage).toBe('foo');
            });
        });

    });



});
