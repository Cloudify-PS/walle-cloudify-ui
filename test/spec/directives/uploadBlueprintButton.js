'use strict';

describe('Directive: uploadBlueprintButton', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<div upload-blueprint-button></div>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('');
    }));
});
