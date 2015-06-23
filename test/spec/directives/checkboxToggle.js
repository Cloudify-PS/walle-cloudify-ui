'use strict';

describe('Directive: checkboxToggle', function () {
    beforeEach(module('cosmoUiApp','backend-mock'));

    var element;

    it('should transclude content', inject(function ($rootScope, $compile) {
        element = angular.element('<div checkbox-toggle value="myVal">foo<button class="active" value="bar"></button><span class="active" ></span></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();

        expect(element.text()).toBe('foo');

        element.find('button').click();
        expect(element.find('.active').length).toBe(1);

        expect($rootScope.myVal).toBe('bar');
    }));
});
