'use strict';

describe('Directive: columnsOrganizer', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));
    var element;
    var scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        scope.columns = [//default columns that can be override
            {name: 'Event Type Icon', isSelected: true},
            {name: 'Timestamp', isSelected: false}
        ];
    }));

    var setup = inject(function ($compile) {
        element = angular.element('<columns-organizer columns="columns"></columns-organizer>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    it('should have selected class and checked icon', function () {
        scope.columns = [
            {name: 'Event Type Icon', isSelected: true}
        ];
        setup();

        var column = element.find('li')[0];
        expect(column.getAttribute('class').indexOf('selected')).not.toBe(-1);

        var checkIcon = element.find('li i')[0];
        expect(checkIcon.getAttribute('class').indexOf('fa-check-square')).not.toBe(-1);
        expect(checkIcon.getAttribute('class').indexOf('fa-square-o')).toBe(-1);
    });

    it('should not have selected class and have a not checked icon', function () {
        scope.columns = [
            {name: 'Event Type Icon', isSelected: false}
        ];

        setup();

        var column = element.find('li')[0];
        expect(column.getAttribute('class').indexOf('selected')).toBe(-1);

        var checkIcon = element.find('li i')[0];
        expect(checkIcon.getAttribute('class').indexOf('fa-check-square')).toBe(-1);
        expect(checkIcon.getAttribute('class').indexOf('fa-square-o')).not.toBe(-1);
    });

    it('should change isSelected value on click', function () {
        scope.columns = [
            {name: 'Event Type Icon', isSelected: false},
            {name: 'Timestamp', isSelected: true}
        ];

        setup();

        var column = element.find('li');
        column.trigger('click');

        expect(scope.columns[0].isSelected).toBe(true);
        expect(scope.columns[1].isSelected).toBe(false);
    });
});
