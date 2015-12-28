'use strict';

describe('Directive: cfyStPersist', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var scope,
        element,
        tableId,
        controller,
        rootScope;
    var _ = window._;

    beforeEach(inject(function ($rootScope, $compile) {
        tableId = 'tab_1';
        scope = $rootScope.$new();
        scope.loaded = false;
        scope.displayed = [];
        scope.myPipe = function () {
            scope.displayed = new Array(100);
        };
        element = angular.element('<div id="' + tableId + '" st-table="displayed" st-pipe="myPipe">' +
            '<div st-search="searchId"</div>' +
            '<div cfy-st-persist content-loaded="loaded" items-by-page="25" st-table-id="'+tableId+'">' +
            '</div>' +
            '</div>');
        element = $compile(element)(scope);
        controller = element.controller('stTable');
        rootScope = $rootScope;
    }));


    it('should set table params from route', inject(function($routeParams) {

        var pageNo = 3;
        var sortBy = 'something';
        var reverse = true;
        var id = 'myId';

        $routeParams['pageNo'+tableId] = pageNo;
        $routeParams['sortBy'+tableId] = sortBy;
        $routeParams['reverse'+tableId] = reverse;
        $routeParams['searchId'+tableId] = id;

        scope.loaded = true;
        scope.$digest();
        expect(Math.floor(controller.tableState().pagination.start/controller.tableState().pagination.number)).toEqual(pageNo-1);
        expect(controller.tableState().sort.predicate).toEqual(sortBy);
        expect(controller.tableState().sort.reverse).toEqual(reverse);
        expect(controller.tableState().search.predicateObject.searchId).toBeDefined();
        expect(controller.tableState().search.predicateObject.searchId).toEqual(id);
    }));

    it('should set route params from table state - page and sort', inject(function ($location) {

        var q = _.object(['pageNo' + tableId, 'sortBy' + tableId, 'reverse' + tableId],['3', 'something', false]);

        spyOn($location, 'search').and.callThrough();
        scope.loaded = true;
        scope.$digest();

        controller.tableState().pagination.start = (parseInt(q['pageNo' + tableId], 10) - 1) * controller.tableState().pagination.number;
        controller.tableState().sort.predicate = q['sortBy' + tableId];
        controller.tableState().sort.reverse = q['reverse' + tableId];

        scope.$digest();
        q['reverse'+tableId] = q['reverse'+tableId].toString();
        expect($location.search).toHaveBeenCalledWith(q);

    }));

    it('should set route params from table state - search', inject(function ($location) {

        var q = _.object(['pageNo' + tableId, 'searchId' + tableId],['1', 'sth']);

        spyOn($location, 'search').and.callThrough();
        scope.loaded = true;
        scope.$digest();

        controller.search(q['searchId' + tableId], 'searchId');

        scope.$digest();

        expect($location.search).toHaveBeenCalledWith(q);

    }));
});
