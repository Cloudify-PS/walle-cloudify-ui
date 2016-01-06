'use strict';

describe('Directive: tooltip', function () {

    var element;
    var scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    function compileDirective(opts) {
        inject(function ($compile, $rootScope, $httpBackend) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div tooltip>my text</div>'))(scope);

            scope.$digest();
        });
    }

    describe('Directive tests', function () {
        it('should add title attribute to element with the element text', function () {
            compileDirective();
            expect(element.attr('title')).toBe(element.text());
        });
    });
});
