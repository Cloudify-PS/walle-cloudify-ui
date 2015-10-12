'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:stPersist
 * @description responsible for keeping the smart-table state using the route search queries
 * HOW TO USE: put st-persist attribute to a child of st-table element. Be sure to provide items-by-page and content-loaded attributes as well.
 * content-loaded is informing the directive that table data has been loaded and we can apply filters and sorting to the table;
 * otherwise smart-table will apply it's default settings once the data has been loaded and write these default settings to route params
 * The last attribute is st-table-id which will identify a table in route params - useful when multiple tables are show on one page
 * # stPersist
 */
angular.module('cosmoUiApp')
    .directive('cfyStPersist', function ($location, $routeParams) {
        return {
            require: '^stTable',
            scope: {
                contentLoaded: '=',
                itemsByPage: '=',
                stTableId: '@'
            },
            link: function postLink(scope, element, attr, ctrl) {

                var searchParams = [];

                /**
                 * looking for search directives inside relevant st-table element
                 */
                angular.element('#'+scope.stTableId+' [st-search]').each(function (){
                    searchParams.push(angular.element(this).attr('st-search'));
                });
                angular.element('#'+scope.stTableId+' [cfy-st-search]').each(function (){
                    searchParams.push(angular.element(this).attr('predicate'));
                });

                scope.$watch('contentLoaded', function(val){
                    if(val) {
                        setFromRoute();
                        startWatch();
                    }
                });

                function startWatch() {
                    scope.$watch(function () {
                        return ctrl.tableState();
                    }, setRoute, true);
                }

                function setRoute(tableState) {

                    var paginationState = tableState.pagination;
                    var routeObject = {};
                    var sort = tableState.sort;

                    routeObject['pageNo'+scope.stTableId] = Math.floor(paginationState.start / paginationState.number) + 1 + '';
                    if(typeof sort.predicate !== 'undefined') {
                        routeObject['sortBy' + scope.stTableId] = sort.predicate;
                        routeObject['reverse' + scope.stTableId] = sort.reverse;
                    }

                    var prObj = _.mapKeys(tableState.search.predicateObject, function(value, key){
                        return key + scope.stTableId;
                    });
                    _.extend(routeObject, prObj);

                    routeObject = _.mapValues(routeObject, function(val){
                        if(typeof val !== 'string'){
                            return encodeURIComponent(JSON.stringify(val));
                        }
                        return val;
                    });
                    $location.search(routeObject);
                }

                function setFromRoute(){

                    // sorting
                    if($routeParams.hasOwnProperty('sortBy' + scope.stTableId)) {
                        var predicate = $routeParams['sortBy' + scope.stTableId];
                        var reverse;
                        try {
                            reverse = JSON.parse($routeParams['reverse' + scope.stTableId]);
                            ctrl.tableState().sort.predicate = predicate;
                            ctrl.tableState().sort.reverse = reverse;
                            //ctrl.sortBy(predicate, reverse);
                        } catch (e) {

                        }
                    }
                    // paging
                    var pageNo = parseInt($routeParams['pageNo'+scope.stTableId], 10) || 1;
                    ctrl.slice((pageNo - 1) * scope.itemsByPage, scope.itemsByPage);
                    //search
                    searchParams.forEach(function(param){
                        if($routeParams.hasOwnProperty(param+scope.stTableId)){
                            var query;
                            try {
                                query = JSON.parse(decodeURIComponent($routeParams[param+scope.stTableId]));
                            }catch(e) {
                                query = $routeParams[param+scope.stTableId];
                            }
                            ctrl.tableState().search.predicateObject[param] = query;
                        }
                    });
                    ctrl.pipe();
                }
            }
        };
    });
