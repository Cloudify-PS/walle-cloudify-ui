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

    it('should query table on gte attribute change', function () {
        scope.predicate = 'predicate';
        scope.gte = new moment('2015-10-16T16:30:00.000Z');
        element = angular.element('<table st-table=""><div cfy-st-search gte="{{gte}}" predicate="{{predicate}}"></div></table>');
        initDirective();
        scope.gte = new moment('2016-11-17T17:40:00.000Z');
        scope.$digest();
        expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : '"2015-10-16T16:30:00.000Z"' }, 'predicate' );
        expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : '"2016-11-17T17:40:00.000Z"' }, 'predicate' );
    });

    it('should query table on lte attribute change', function () {
        scope.predicate = 'predicate';
        scope.lte = new moment('2010-10-10T10:10:00.000Z');
        element = angular.element('<table st-table=""><div cfy-st-search lte="{{lte}}" predicate="{{predicate}}"></div></table>');
        initDirective();
        scope.lte = new moment('2011-11-11T11:11:00.000Z');
        scope.$digest();
        expect(stTableCtrl.search).toHaveBeenCalledWith( { lte : '"2010-10-10T10:10:00.000Z"' }, 'predicate' );
        expect(stTableCtrl.search).toHaveBeenCalledWith( { lte : '"2011-11-11T11:11:00.000Z"' }, 'predicate' );
    });

    it('should query table with lte and gte', function () {
        scope.predicate = 'predicate';
        scope.gte = new moment('2015-10-16T16:30:00.000Z');
        scope.lte = new moment('2010-10-10T10:10:00.000Z');
        element = angular.element('<table st-table=""><div cfy-st-search gte={{gte}} lte="{{lte}}" predicate="{{predicate}}"></div></table>');
        initDirective();
        scope.gte = new moment('2016-11-17T17:40:00.000Z');
        scope.lte = new moment('2011-11-11T11:11:00.000Z');
        scope.$digest();
        expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : '"2015-10-16T16:30:00.000Z"', lte : '"2010-10-10T10:10:00.000Z"' }, 'predicate' );
        expect(stTableCtrl.search).toHaveBeenCalledWith( { gte : '"2016-11-17T17:40:00.000Z"', lte : '"2011-11-11T11:11:00.000Z"' }, 'predicate' );
    });
});
