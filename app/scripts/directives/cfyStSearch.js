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

                var skipSearches = {
                    blueprint_id:false,
                    deployment_id: false,
                    log_level: false
                };

                function isSkipSearchMatch(){
                    if(skipSearches[attrs.predicate]){
                        skipSearches[attrs.predicate] = false;
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
                //function createRangeQuery(){
                //    var query = {};
                //    if(attrs.gte && attrs.gte.length>0) {
                //        query.gte = attrs.gte;
                //    }
                //    if(attrs.lte && attrs.lte.length>0)
                //    {
                //        query.lte = attrs.lte;
                //    }
                //    return query;
                //}

                //if(attrs.gte) {
                //    attrs.$observe('gte', function (value) {
                //        if(isSkipSearchMatch){
                //            return;
                //        }
                //        if(value || value === ''){
                //            var query = createRangeQuery();
                //            queryTable(query);
                //        }
                //    });
                //}
                //
                //if(attrs.lte) {
                //    attrs.$observe('lte', function (value) {
                //        if(isSkipSearchMatch){
                //            return;
                //        }
                //        if(value || value === ''){
                //            var query = createRangeQuery();
                //            queryTable(query);
                //        }
                //    });
                //}

                scope.$watch(function () {
                    return table.tableState().search.predicateObject[attrs.predicate];
                }, function (query) {

                    //This checks if the state was changed from outside of this directive, so the model didn't updated
                    function isModelDifferentFromQuery(model, queryValues){
                        //is ngModel different from the queried value?
                        return !_.isEqual(_.pluck(model,'value'), queryValues);
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
                        var queryValues = Array.isArray(query.matchAny) ? query.matchAny : JSON.parse(query.matchAny);
                        var ngModel = attrs.ngModel;
                        if(!!queryValues) {
                            //check if state is different
                            if(isModelDifferentFromQuery(_.get(scope, ngModel),queryValues)){
                                var selectedOptions = getSelectedOptions(queryValues);
                                skipSearches[attrs.predicate] = true;
                                _.set(scope, ngModel, selectedOptions);
                            }
                        }
                    }
                    catch(e)
                    {
                        console.error(e.message);
                    }
                }, true);

                function queryTable(query) {
                    table.search(query, attrs.predicate || '');
                }
            }
        };
    });
