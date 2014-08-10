'use strict';

describe('Directive: header', function () {

    beforeEach(module('cosmoUiApp'));

    var element, scope;

    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope.$new();
        element = $compile(angular.element('<div header></div>'))(scope);
    }));

    it('should create an element', function() {
//        expect(element).not.toBeUndefined();
    });
});
