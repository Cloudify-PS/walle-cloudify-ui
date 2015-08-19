'use strict';

describe('Directive: bpActionSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<bp-action-selector></bp-action-selector>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('');
    }));
});
