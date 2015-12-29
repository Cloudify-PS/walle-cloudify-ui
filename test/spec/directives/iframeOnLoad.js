'use strict';

describe('Directive: iframeOnload', function () {

    var element;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    it('should trigger function on load', inject(function ($rootScope, $compile) {
        $rootScope.doSomething = jasmine.createSpy();
        element = angular.element('<div iframe-onload="doSomething()"></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();

        var e = $.Event('load');
        $(element).trigger(e);

        $rootScope.$apply();
        expect($rootScope.doSomething).toHaveBeenCalled();
    }));

});
