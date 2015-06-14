'use strict';

describe('Directive: deploymentEvents', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', 'templates-main'));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
        $httpBackend.whenPOST('/backend/events/_search').respond(200);

        scope = $rootScope.$new();
        element = $compile(angular.element('<div deployment-events></div>'))(scope);

        $rootScope.$apply();

        scope = element.isolateScope();
        scope.$apply();
    }));

    describe('deploymentEvents scope', function () {

        it('should create scope object', function () {
            expect(scope).not.toBeUndefined();
        });

        it('should create an element with getEventIcon function', function () {
            expect(typeof(scope.getEventIcon)).toBe('function');
        });

        it('should create an element with getEventText function', function () {
            expect(typeof(scope.getEventText)).toBe('function');
        });

        it('should create an element with lastEvent function', function () {
            expect(typeof(scope.lastEvent)).toBe('function');
        });

        it('should create an element with hasLastEvent function', function () {
            expect(typeof(scope.hasLastEvent)).toBe('function');
        });

        it('should create an element with dragIt function', function () {
            expect(typeof(scope.dragIt)).toBe('function');
        });

        it('should have events-widget div', function () {
            expect(element.find('div.events-widget').length).toBe(1);
        });

        it('should have opacity background div', function () {
            expect(element.find('div.bg').length).toBe(1);
        });

        it('should have head div', function () {
            expect(element.find('div.head').length).toBe(1);
        });

        it('should have containList div', function () {
            expect(element.find('div.containList').length).toBe(1);
        });

    });


    describe('drag head functionality', function () {
        it('should change the height', function(){

            element.css({ height: 250, width: 200});
            $('body').append(element);
            $('body').addClass('bpContainer');
            $('body').attr('id','main-content');
            var eventsList = element.find('.containList');
            var dragBtn = element.find('.dragBtn');
            dragBtn.simulate('drag', { dy:10}); // drag once to enforce maxHeight..
            var firstHeight = eventsList.height();
            dragBtn.simulate('drag', { dy:10}); // actual drag.
            var lastHeight =  eventsList.height();
            expect(firstHeight - lastHeight).toBe(10);
            $('body').removeClass('bpContainer');
            $('body').attr('id',null);
            element.remove();
        });

    });

});
