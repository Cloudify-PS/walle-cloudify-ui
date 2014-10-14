'use strict';

describe('Directive: deploymentEvents', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper', 'templates-main', 'gsMocks'));

    describe('Test setup', function() {
        it ('Injecting required data', inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile(angular.element('<div deployment-events></div>'))(scope);

            $rootScope.$apply();

            scope = element.isolateScope();
            scope.$apply();
        }));
    });

    describe('Directive tests', function() {

        it('should create scope object', function() {
            expect(scope).not.toBeUndefined();
        });

        it('should create an element with getEventIcon function', function() {
            expect(typeof(scope.getEventIcon)).toBe('function');
        });

        it('should create an element with getEventText function', function() {
            expect(typeof(scope.getEventText)).toBe('function');
        });

        it('should create an element with lastEvent function', function() {
            expect(typeof(scope.lastEvent)).toBe('function');
        });

        it('should create an element with hasLastEvent function', function() {
            expect(typeof(scope.hasLastEvent)).toBe('function');
        });

        it('should create an element with dragIt function', function() {
            expect(typeof(scope.dragIt)).toBe('function');
        });

        it('should have events-widget div', function() {
            expect(element.find('div.events-widget').length).toBe(1);
        });

        it('should have opacity background div', function() {
            expect(element.find('div.bg').length).toBe(1);
        });

        it('should have head div', function() {
            expect(element.find('div.head').length).toBe(1);
        });

        it('should have containList div', function() {
            expect(element.find('div.containList').length).toBe(1);
        });

        it('should have one event', function() {
            expect(scope.events.length).toBe(1);
        });

    });

});
