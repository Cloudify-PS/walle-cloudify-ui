'use strict';

describe('Directive: deploymentActionSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element,
        scope,
        _$compile,
        _ngDialog;

    beforeEach(inject(function ($rootScope, $compile, ngDialog) {
        _$compile = $compile;
        _ngDialog = ngDialog;
        scope = $rootScope.$new();
        scope.deployment = {id: 'foo'};
        scope.currentExecution = {};
        scope.onSubmit = jasmine.createSpy('onSubmit');
        element = angular.element('<div class="deployment-action-selector" deployment="deployment" current-execution="currentExecution" on-submit="onSubmit()"></div>');
        element = _$compile(element)(scope);
    }));

    it('should overflow and elipsis text', inject(function () {
        scope.currentExecution = 'A very very very verrryyyyyy long workflow name';
        scope.$digest();
        // only after we add to body, the css will be applied
        $('body').append(element);
        var $selectedAction = $('#split-button');
        expect($selectedAction.css('overflow')).toBe('hidden');
        expect($selectedAction.css('text-overflow')).toBe('ellipsis');
        element.remove();
    }));

    it('should toggle delete confirmation dialog when deleteDeployment is selected', inject(function () {
        spyOn(_ngDialog, 'open').andCallThrough();
        scope.$digest();
        var deleteAction = element.isolateScope().actions.filter(function (a) {
            return a.name === 'deployments.deleteBtn';
        })[0];
        element.isolateScope().selectAction(deleteAction);

        expect(element.isolateScope().itemToDelete.id).toBe(element.isolateScope().deployment.id);
        expect(_ngDialog.open).toHaveBeenCalled();
    }));
});
