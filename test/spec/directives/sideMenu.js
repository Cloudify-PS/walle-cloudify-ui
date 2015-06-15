'use strict';

describe('Directive: sideMenu', function () {
    beforeEach(module('cosmoUiApp','backend-mock','templates-main'));

    var element;

    it('should put items on scope', inject(function ($rootScope, $compile) {
        element = angular.element('<div side-menu></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var isolateScope = element.children().scope();
        expect( !!isolateScope.items ).toBe(true);
    }));
});
