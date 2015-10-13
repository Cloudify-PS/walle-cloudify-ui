'use strict';

describe('Directive: cfyStSearch', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock'));

    var element,
        scope;

    var _$compile, stTableCtrl;

    beforeEach(inject(function ($rootScope, $httpBackend, $compile) {
        _$compile = $compile;
        element = null;
        scope = $rootScope.$new();

        //mock stTable controller
        stTableCtrl = {
            search: function () {
            },
            tableState: function () {
            }
        };
        spyOn(stTableCtrl, 'search').andCallThrough();
        spyOn(stTableCtrl, 'tableState').andReturn({
            search: {
                predicateObject:{
                }
            }
        });

    }));

    var initDirective = function () {
        //replacing the required controller with the mocked one
        element.data('$stTableController', stTableCtrl);
        _$compile(element)(scope);
        scope.$digest();
    };


    it('should query table on match attribute change', function () {
        scope.predicate = 'predicate';
        scope.match = '[]';
        element = angular.element('<table st-table=""><div cfy-st-search match="{{match}}" predicate="{{predicate}}"></div></table>');
        initDirective();
        scope.match = ['some value'];
        scope.$digest();
        expect(stTableCtrl.search).toHaveBeenCalledWith( { matchAny : '[]' }, 'predicate' );
        expect(stTableCtrl.search).toHaveBeenCalledWith( { matchAny : '["some value"]' }, 'predicate' );
    });

    //it('should query table on gte attribute change', function () {
    //    scope.predicate = 'predicate';
    //    scope.gte = 'now';
    //    element = angular.element('<table st-table=""><div cfy-st-search gte="{{gte}}" predicate="{{predicate}}"></div></table>');
    //    initDirective();
    //    scope.gte = 'yesterday';
    //    scope.$digest();
    //    expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : 'now' }, 'predicate' );
    //    expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : 'yesterday' }, 'predicate' );
    //});
    //
    //it('should query table on lte attribute change', function () {
    //    scope.predicate = 'predicate';
    //    scope.lte = 'now';
    //    element = angular.element('<table st-table=""><div cfy-st-search lte="{{lte}}" predicate="{{predicate}}"></div></table>');
    //    initDirective();
    //    scope.lte = 'tomorrow';
    //    scope.$digest();
    //    expect(stTableCtrl.search).toHaveBeenCalledWith( { lte : 'now' }, 'predicate' );
    //    expect(stTableCtrl.search).toHaveBeenCalledWith( { lte : 'tomorrow' }, 'predicate' );
    //});
    //
    //it('should query table with lte and gte', function () {
    //    scope.predicate = 'predicate';
    //    scope.lte = 'now';
    //    scope.gte = 'now';
    //    element = angular.element('<table st-table=""><div cfy-st-search gte={{gte}} lte="{{lte}}" predicate="{{predicate}}"></div></table>');
    //    initDirective();
    //    scope.lte = 'tomorrow';
    //    scope.gte = 'yesterday';
    //    scope.$digest();
    //    expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : 'now', lte : 'now' }, 'predicate' );
    //    expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : 'yesterday', lte : 'tomorrow' }, 'predicate' );
    //});
});
