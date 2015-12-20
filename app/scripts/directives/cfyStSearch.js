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
                    level: 0,
                    timestamp: 0,
                    message: 0,
                    event_type: 0
                };

                function isSkipSearchMatch(){
                    if(skipSearches[attrs.predicate] > 0){
                        skipSearches[attrs.predicate]--;
                        return true;
                    }
                    return false;
                }

                if(attrs.match !== undefined) {
                    attrs.$observe('match', function (value) {
                        if(isSkipSearchMatch()){
                            return;
                        }
                        if (value || value === '') {
                            var query = {};
                            query.matchAny = value;
                            if (query.matchAny.length === 0) {
                                query.matchAny = '[]';
                            }
                            queryTable(query);
                        }
                    });
                }

                if(attrs.equal !== undefined) {
                    attrs.$observe('equal', function (value) {
                        if(isSkipSearchMatch()){
                            return;
                        }
                        if (value || value === '') {
                            var query = {};
                            query.equalTo = value;
                            queryTable(query);
                        }
                    });
                }

                //Please notice that in order for range query to work both, lte and gte must be on the same element
                function createRangeQuery(){
                    var query = {};
                    if(attrs.gte && attrs.gte.length>0) {
                        query.gte = getParsedValue(attrs.gte);
                    }
                    if(attrs.lte && attrs.lte.length>0)
                    {
                        query.lte = getParsedValue(attrs.lte);
                    }
                    return query;
                }

                function getParsedValue(value){
                    if(value.indexOf('\"') !== -1){
                        value = value.replace(new RegExp('\"', 'g'), '');
                    }
                    if(moment(value, 'YYYY-MM-DD HH:mm', true).isValid()){
                        return moment(value, 'YYYY-MM-DD HH:mm').toISOString();
                    }
                    if(moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ',true).isValid()) {
                        return value;
                    }
                    return '';
                }

                if(attrs.gte !== undefined) {
                    attrs.$observe('gte', function (value) {
                        if (value !== undefined && !isSkipSearchMatch()) {
                            var query = createRangeQuery();
                            queryTable(query);
                        }
                    });
                }

                if(attrs.lte !== undefined) {
                    attrs.$observe('lte', function (value) {
                        if (value !== undefined && !isSkipSearchMatch()) {
                            var query = createRangeQuery();
                            queryTable(query);
                        }
                    });
                }

                scope.$watch(function () {
                    return table.tableState().search.predicateObject[attrs.predicate];
                }, function (query) {

                    if(!query){
                        return;
                    }

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
                            var gte = query.gte;
                            var gteModel = 'eventsFilter.timeRange.gte';
                            var gteParsedModel = _.get(scope, gteModel);
                            gteParsedModel = gteParsedModel.constructor.name === 'Moment' ? gteParsedModel.toISOString() : getParsedValue(gteParsedModel);
                            //check if state is different
                            if(isModelDifferentFromQuery(gteParsedModel, gte)) {
                                if (query.gte !== undefined) {
                                    skipSearches[attrs.predicate]++;
                                    _.set(scope, gteModel, new moment(gte));
                                }
                            }
                        }
                        if(query.lte !== undefined) {
                            var lte = query.lte;
                            var lteModel = 'eventsFilter.timeRange.lte';
                            var lteParsedModel = _.get(scope, lteModel);
                            lteParsedModel = lteParsedModel.constructor.name === 'Moment' ? lteParsedModel.toISOString() : getParsedValue(lteParsedModel);
                            //check if state is different
                            if(isModelDifferentFromQuery(lteParsedModel, lte)) {
                                if (query.lte !== undefined) {
                                    skipSearches[attrs.predicate]++;
                                    _.set(scope, lteModel, new moment(lte));
                                }
                            }
                        }
                        if(query.equalTo !== undefined){
                            var equalQuery = query.equalTo;
                            var equalNgModel = attrs.ngModel;
                            if (!!equalQuery) {
                                //check if state is different
                                if (isModelDifferentFromQuery(_.get(scope, equalNgModel), equalQuery)) {
                                    skipSearches[attrs.predicate]++;
                                    _.set(scope, equalNgModel, equalQuery);
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
