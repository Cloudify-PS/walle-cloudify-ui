'use strict';

describe('Directive: bpActionSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var element;
    var scope;
    var _$compile;
    var _ngDialog;

    beforeEach(inject(function ($routeParams, $rootScope, $compile, ngDialog) {
        _$compile = $compile;
        _ngDialog = ngDialog;
        scope = $rootScope.$new();
        scope.blueprint = {'id': 'foo'};
        element = angular.element('<div class="bp-action-selector" on-create="redirectToDeployment(id)" on-delete="loadBlueprints()" blueprint="blueprint"></div>');
        element = _$compile(element)(scope);
    }));

    it('should make hidden element visible', inject(function () {
        expect(element.text()).toBe('');
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

    it('should open delete confirmation dialog when deleteBlueprint is selected', function () {
        spyOn(_ngDialog, 'open').and.callThrough();
        scope.$digest();
        element.isolateScope().selectAction(element.isolateScope().actions[1]);
        expect(_ngDialog.open).toHaveBeenCalled();
    });

    describe('#openDeployDialog', function () {
        it('should open dialog', inject(function (ngDialog) {
            spyOn(ngDialog, 'open').and.returnValue();
            scope.$digest();
            element.isolateScope().selectAction(element.isolateScope().actions[0]);
            expect(ngDialog.open).toHaveBeenCalled();
        }));
    });

    it('should open deploy dialog if routeParams include deploy=true', inject(function ($routeParams, ngDialog, $httpBackend) {
        spyOn(ngDialog, 'open').and.returnValue();
        $routeParams.deploy = 'true';
        $httpBackend.whenGET('/backend/cloudify-api/blueprints/' + scope.blueprint.id).respond(200);
        scope.$digest();
        expect(ngDialog.open).toHaveBeenCalled();
    }));
});
