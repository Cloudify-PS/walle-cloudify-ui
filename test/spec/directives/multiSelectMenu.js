'use strict';

describe('Directive: multiSelectMenu', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp','backend-mock', 'templates-main'));

    describe('Test setup', function() {
        beforeEach(inject(function($rootScope, $compile, $document){
            element = angular.element('' +
                '<div multi-select-menu ' +
                'data-multiple="true" ' +
                'data-options="options" ' +
                'data-ng-model="selected" ' +
                'data-init="TestValue" ' +
                'data-text="Choose Options" ' +
                'data-listener="true" ' +
                'name="blueprints"></div>');

            scope = $rootScope;

            scope.options = [
                {'label': 'TestLabel', 'value': 'TestValue'},
                {'label': 'TestLabel2', 'value': 'TestValue2'},
                {'groupLabel': 'group1'},
                {'label': 'GroupItem1', 'value': 'GroupItem1'},
                {'label': 'GroupItem2', 'value': 'GroupItem2'},
                {'groupLabel': 'group2'},
                {'label': 'GroupItem3', 'value': 'GroupItem3'}
            ];

            $document.click = function() {};
            $document.keyup = function() {};

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have initialize default value', function(){
            expect(scope.selected[0].value).toBe('TestValue');
        });

        it('should deselect non-relevant selected options', function(){
            scope.options = [
                {'label': 'NewLabel', 'value': 'NewValue'}
            ];
            scope.$apply();

            expect(scope.selected.length).toBe(0);
        });

        it('should filter options', function(){
            element.isolateScope().filter = '2';
            scope.$apply();
            expect(element.isolateScope().filteredItems).toEqual(
                [
                    {'label': 'TestLabel2', 'value': 'TestValue2'},
                    {'groupLabel': 'group1'},
                    {'label': 'GroupItem2', 'value': 'GroupItem2'}
                ]
            );
        });

        it('should watch changed options', function(){
            element.isolateScope().filter = '';
            scope.options = [
                {'label': 'TestLabel', 'value': 'TestValue'},
                {'label': 'TestLabel2', 'value': 'TestValue2'},
                {'groupLabel': 'group1'},
                {'label': 'GroupItem1', 'value': 'GroupItem1'},
                {'label': 'GroupItem2', 'value': 'GroupItem2'},
                {'groupLabel': 'group2'},
                {'label': 'GroupItem3', 'value': 'GroupItem3'},
                {'groupLabel': 'group3'},
                {'label': 'GroupItem4', 'value': 'GroupItem4'}
            ];
            scope.$digest();
            expect(element.isolateScope().filteredItems).toEqual(scope.options);

            element.isolateScope().filter = '2';
            scope.$apply();

            scope.options = [
                {'label': 'TestLabel', 'value': 'TestValue'},
                {'label': 'TestLabel2', 'value': 'TestValue2'},
                {'groupLabel': 'group1'},
                {'label': 'GroupItem1', 'value': 'GroupItem1'},
                {'label': 'GroupItem2', 'value': 'GroupItem2'},
                {'groupLabel': 'group2'},
                {'label': 'GroupItem3', 'value': 'GroupItem3'},
                {'groupLabel': 'group3'},
                {'label': 'GroupItem24', 'value': 'GroupItem24'}
            ];
            scope.$apply();
            expect(element.isolateScope().filteredItems).toEqual(
                [
                    {'label': 'TestLabel2', 'value': 'TestValue2'},
                    {'groupLabel': 'group1'},
                    {'label': 'GroupItem2', 'value': 'GroupItem2'},
                    {'groupLabel': 'group3'},
                    {'label': 'GroupItem24', 'value': 'GroupItem24'}
                ]
            );
        });
    });
});
