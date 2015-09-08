'use strict';

describe('Directive: actionSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<action-selector></action-selector>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('');
    }));
});
