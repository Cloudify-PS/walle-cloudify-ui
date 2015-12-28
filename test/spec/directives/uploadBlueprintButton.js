'use strict';

describe('Directive: uploadBlueprintButton', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var element;
    var scope;
    var _ngDialog;

    beforeEach(inject(function ($rootScope, ngDialog, $compile) {
        scope = $rootScope.$new();
        _ngDialog = ngDialog;
        element = angular.element('<div upload-blueprint-button>transclude me</div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should make hidden element visible', function () {
        expect(element.text()).toBe('transclude me\n');
    });

    it('should open upload blueprint dialog when pressed', function () {
        spyOn(_ngDialog, 'open').and.callThrough();
        element.isolateScope().openAddDialog();
        expect(_ngDialog.open).toHaveBeenCalled();
    });

    it('should go to blueprint page after upload succeeded', inject(function ($location) {
        spyOn($location, 'path');
        element.isolateScope().uploadDone('blueprint_id');
        expect($location.path).toHaveBeenCalledWith('/blueprint/blueprint_id/topology');
    }));
});
