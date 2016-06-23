'use strict';

describe('Directive: cancelExecution', function () {
    // load the directive's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var element,
    scope, ngDialog;

    beforeEach(inject(function ($rootScope, _ngDialog_) {
        scope = $rootScope.$new();
        ngDialog = _ngDialog_;
        spyOn(ngDialog, 'open').and.callThrough();
    }));

    var setup = inject(function( $compile ){
        element = angular.element('<cancel-execution execution="execution"></cancel-execution>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    it('should not open dialog if there is no execution', function(){
        setup();
        element.children().first().triggerHandler('click');
        expect(ngDialog.open).not.toHaveBeenCalled();
    });

    it('should open cancel execution dialog on click', inject(function () {
        scope.execution = {
            id: 'c1c24a86-02b8-4b49-8cb4-82f2f8887da9',
            deployment_id: 'dep1',
            status: 'started'
        };
        setup();
        element.children().first().triggerHandler('click');

        expect(ngDialog.open).toHaveBeenCalledWith({
            template: 'views/deployment/cancelExecutionDialog.html',
            controller: 'CancelExecutionDialogCtrl',
            scope: _.merge(element.isolateScope(), {currentExecution: scope.execution}),
            className: 'confirm-dialog'
        });
    }));
});
