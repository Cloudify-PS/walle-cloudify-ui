'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:cfyStSearch
 * @description
 * # cfyStSearch
 */
angular.module('cosmoUiApp')
    .directive('cfyStSearch', function () {
        return {
            require: '^stTable',
            restrict: 'A',
            link: function postLink(scope, element, attrs, table) {

                if(attrs.match) {
                    attrs.$observe('match', function (value) {
                            if(value) {
                                var query = {};
                                query.matchAny = value;
                                if (query.matchAny.length === 0) {
                                    query.matchAny = '[]';
                                }
                                queryTable(query);
                            }
                        }
                    );
                }

                //Please notice that in order for range query to work both, lte and gte must be on the same element
                function createRangeQuery(){
                    var query = {};
                    if(attrs.gte && attrs.gte.length>0) {
                        query.gte = attrs.gte;
                    }
                    if(attrs.lte && attrs.lte.length>0)
                    {
                        query.lte = attrs.lte;
                    }
                    return query;
                }

                if(attrs.gte) {
                    attrs.$observe('gte', function (value) {
                        if(value || value === ''){
                            var query = createRangeQuery();
                            queryTable(query);
                        }
                    });
                }

                if(attrs.lte) {
                    attrs.$observe('lte', function (value) {
                        if(value || value === ''){
                            var query = createRangeQuery();
                            queryTable(query);
                        }
                    });
                }

                function queryTable(query) {
                    table.search(query, attrs.predicate || '');
                }
            }
        };
    });
