'use strict';

describe('Directive: toggleSwitch', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock','templates-main' , function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        scope.value = 'foo';
        element = angular.element('<toggle-switch value="value"></toggle-switch>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(scope.value).toBe('foo');

        var isolatedScope = element.children().scope();
        isolatedScope.toggleButton();

        expect(isolatedScope.value).toBe(false);
    }));
});
