'use strict';

describe('Directive: bpTopologyNodes', function () {

    var element, scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    function compileDirective(opts) {
        inject(function($compile, $rootScope, $httpBackend) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div bp-topology-nodes></div>'))(scope);

            scope.$digest();
        });
    }

    describe('Directive tests', function() {
        it('should create an element with getBadgeStatus function', function() {
            compileDirective();
            expect(typeof(element.isolateScope().getBadgeStatus)).toBe('function');
        });

        it('should return the badge status by its status id using the getBadgeStatus function', function() {
            compileDirective();
            expect(element.isolateScope().getBadgeStatus(0)).toBe('install');
            expect(element.isolateScope().getBadgeStatus(1)).toBe('done');
            expect(element.isolateScope().getBadgeStatus(2)).toBe('alerts');
            expect(element.isolateScope().getBadgeStatus(3)).toBe('failed');
            expect(element.isolateScope().getBadgeStatus()).toBe('install');
        });

        it('should return type class using the getTypeClass method', function() {
            compileDirective();
            expect(element.isolateScope().getTypeClass('MyType')).toBe('cloudify-nodes-MyType');
        });
    });
});
