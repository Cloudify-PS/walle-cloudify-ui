'use strict';

describe('Directive: ngEnter', function () {
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div ng-enter></div>');

        element = $compile(element)($rootScope);
        var e = $.Event('keydown');
        e.which = 13;
        spyOn(e, 'preventDefault');
        $(element).trigger(e);
        expect(e.preventDefault).toHaveBeenCalled();

    }));
});
