'use strict';

describe('Directive: header', function () {

    //load the directive's module
    beforeEach(module('cosmoUiApp'));

    var element, scope;

    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope.$new();
        element = $compile('<div header></div>')(scope);
//
//        element = angular.element("<test header></test>");
//
//        scope = $rootScope;
//        scope.defined = false;
//
//        $compile(element)(scope);
//        scope.$digest();
    }));

    it('should create an element', function() {
//        expect(element).not.toBeUndefined();
//        console.log(element);
    });
});
