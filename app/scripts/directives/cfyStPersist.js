'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:stPersist
 * @description responsible for keeping the smart-table state using the route search queries
 * HOW TO USE: put st-persist attribute to a child of st-table element. Be sure to provide items-by-page and content-loaded attributes as well.
 * content-loaded is informing the directive that table data has been loaded and we can apply filters and sorting to the table;
 * otherwise smart-table will apply it's default settings once the data has been loaded and write these default settings to route params
 * # stPersist
 */
angular.module('cosmoUiApp')
    .directive('cfyStPersist', function ($location, $routeParams) {
        return {
            require: '^stTable',
            scope: {
                contentLoaded: '=',
                itemsByPage: '='
            },
            link: function postLink(scope, element, attr, ctrl) {

                var id = element.parent().attr('id');

                var searchParams = [];
                angular.element('[st-search]').each(function (){
                    searchParams.push(angular.element(this).attr('st-search'));
                });

                scope.$watch('contentLoaded', function(val){
                    if(val) {
                        setFromRoute();
                        startWatch();
                    }
                });

                function startWatch() {
                    scope.$watch(function () {
                        return ctrl.tableState().pagination;
                    }, function () {
                        var paginationState = ctrl.tableState().pagination;
                        var routeObject = {};
                        routeObject['pageNo'+id] = Math.floor(paginationState.start / paginationState.number) + 1 + '';
                        setRoute(routeObject);
                    }, true);
                    scope.$watch(function() {
                        return ctrl.tableState().sort.predicate + ' ' + ctrl.tableState().sort.reverse;
                    }, function(){
                        var sort = ctrl.tableState().sort;
                        var routeObject = {};
                        routeObject['sortBy'+id] = sort.predicate;
                        routeObject['reverse'+id] = sort.reverse;
                        if(sort.predicate && typeof sort.reverse !== 'undefined'){
                            setRoute(routeObject);
                        }
                    });
                    scope.$watch(function() {
                        return ctrl.tableState().search;
                    }, function(val){
                        searchParams = _.keys(val);
                        var prObj = _.mapKeys(val.predicateObject, function(value, key){
                            return key + id;
                        });
                        setRoute(prObj);
                    }, true);
                }

                function setRoute(newParameters) {
                    var searchObj = $location.search();
                    $location.search(_.extend(searchObj, newParameters));
                }

                function setFromRoute(){
                    // paging
                    var pageNo = parseInt($routeParams['pageNo'+id], 10) || 1;
                    ctrl.slice((pageNo - 1) * scope.itemsByPage, scope.itemsByPage);
                    // sorting
                    ctrl.tableState().sort.predicate = $routeParams['sortBy'+id];
                    ctrl.tableState().sort.reverse = $routeParams.hasOwnProperty('reverse'+id) ? $routeParams['reverse'+id] : false;
                    ctrl.pipe();
                    // search
                    searchParams.forEach(function(param){
                        if($routeParams.hasOwnProperty(param)){
                            ctrl.search($routeParams[param], param);
                        }
                    });

                }
            }
        };
    });
