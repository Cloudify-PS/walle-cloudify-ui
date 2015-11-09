'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:cfyStSearch
 * @description
 * # cfyStSearch
 */
angular.module('cosmoUiApp')
    .directive('cfyStSearch', function ($log) {
        return {
            require: '^stTable',
            restrict: 'A',
            link: function postLink(scope, element, attrs, table) {

                var skipSearches = {
                    blueprint_id: 0,
                    deployment_id: 0,
                    log_level: 0,
                    timestamp: 0
                };

                function isSkipSearchMatch(){
                    if(skipSearches[attrs.predicate] > 0){
                        skipSearches[attrs.predicate]--;
                        return true;
                    }
                    return false;
                }

                if(attrs.match) {
                    attrs.$observe('match', function (value) {
                        if(isSkipSearchMatch()){
                            return;
                        }
                        if (value) {
                            var query = {};
                            query.matchAny = value;
                            if (query.matchAny.length === 0) {
                                query.matchAny = '[]';
                            }
                            queryTable(query);
                        }
                    });
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

                if(attrs.gte !== undefined) {
                    attrs.$observe('gte', function (value) {
                        if(isSkipSearchMatch()){
                            return;
                        }
                        if(value || value === ''){
                            var query = createRangeQuery();
                            queryTable(query);
                        }
                    });
                }

                if(attrs.lte !== undefined) {
                    attrs.$observe('lte', function (value) {
                        if(isSkipSearchMatch()){
                            return;
                        }
                        if(value || value === ''){
                            var query = createRangeQuery();
                            queryTable(query);
                        }
                    });
                }

                scope.$watch(function () {
                    return table.tableState().search.predicateObject[attrs.predicate];
                }, function (query) {

                    //This checks if the state was changed from outside of this directive, so the model didn't updated
                    function isModelDifferentFromQuery(model, queryValues){
                        //is ngModel different from the queried value?
                        return !_.isEqual(model, queryValues);
                    }

                    function getSelectedOptions(queryValues){
                        function getOptionObjectByValue(options, value){
                            return _.find(options, 'value', value);
                        }

                        var selectedOptions = [];
                        var options = _.get(scope,attrs.options);
                        _.forEach(queryValues, function (queryValue) {
                            var option = getOptionObjectByValue(options, queryValue);
                            if(!!option){
                                selectedOptions.push(option);
                            }
                        });
                        return selectedOptions;
                    }

                    try {
                        if(query.matchAny !== undefined) {
                            var queryValues = Array.isArray(query.matchAny) ? query.matchAny : JSON.parse(query.matchAny);
                            var ngModel = attrs.ngModel;
                            if (!!queryValues) {
                                //check if state is different
                                if (isModelDifferentFromQuery(_.pluck(_.get(scope, ngModel),'value'), queryValues)) {
                                    var selectedOptions = getSelectedOptions(queryValues);
                                    skipSearches[attrs.predicate]++;
                                    _.set(scope, ngModel, selectedOptions);
                                }
                            }
                        }
                        if(query.gte !== undefined){
                            var gte = JSON.parse(query.gte);
                            var gteModel = 'eventsFilter.timeRange.gte';
                            //check if state is different
                            if (!angular.isFunction(_.get(scope, gteModel).toISOString) || isModelDifferentFromQuery(_.get(scope, gteModel).toISOString(), gte)) {
                                if (query.gte !== undefined) {
                                    skipSearches[attrs.predicate]++;
                                    _.set(scope, gteModel, new moment(gte));
                                }
                            }
                        }
                        if(query.lte !== undefined) {
                            var lte = JSON.parse(query.lte);
                            var lteModel = 'eventsFilter.timeRange.lte';
                            //check if state is different
                            if (!angular.isFunction(_.get(scope, lteModel).toISOString) || isModelDifferentFromQuery(_.get(scope, lteModel).toISOString(), lte)) {
                                if (query.lte !== undefined) {
                                    skipSearches[attrs.predicate]++;
                                    _.set(scope, lteModel, new moment(lte));
                                }
                            }
                        }
                    }
                    catch(e)
                    {
                        $log.error(e.message);
                    }
                }, true);

                function queryTable(query) {
                    table.search(query, attrs.predicate || '');
                }
            }
        };
    });
