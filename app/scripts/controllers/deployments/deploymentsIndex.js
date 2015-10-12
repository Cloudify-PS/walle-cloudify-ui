'use strict';

// TODO: this code should be much more testable
angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, ExecutionsService, $location, $log, cloudifyClient) {

        $scope.deployments = null;
        $scope.executedErr = false;
        $scope.confirmationType = '';

        // holds currently running execution per deployment_id
        var runningExecutions = {};

        $scope.inputs = {};
        $scope.managerError = false;

        $scope.itemsByPage = 9;
        $scope.blueprints = {};
        $scope.deploymentsFilter = {
            blueprints: []
        };

        $scope.getExecution = function (deployment) {
            return _.first(runningExecutions[deployment.id]);
        };

        $scope.canPause = function (deployment_id) {
            return ExecutionsService.canPause($scope.getExecution({id: deployment_id}));
        };

        $scope.isExecuting = function (deployment_id) {
            var execution = $scope.getExecution({'id': deployment_id});
            return !!execution;
        };

        $scope.redirectTo = function (deployment) {
            $location.search({});
            $location.path('/deployment/' + deployment.id + '/topology');
        };

        $scope.layerRedirectTo = function (deployment, event, matchElement) {
            if (event.target.tagName.toLowerCase() + '.' + event.target.className === matchElement) {
                $scope.redirectTo(deployment);
            }
        };

        function _loadExecutions() {

            return cloudifyClient.executions.list(null, 'id,workflow_id,status,deployment_id').then(function (result) {

                //  CFY-2238 - remove terminated workflows.
                runningExecutions = _.groupBy(_.filter(result.data, function (exec) {
                    return ExecutionsService.isRunning(exec);
                }), 'deployment_id');

            }, function () {
                // todo: implement error handling
            });
        }

        $scope.loadDeployments = function () {
            cloudifyClient.deployments.list('id,blueprint_id,created_at,updated_at,workflows,inputs,outputs')
                .then(function (result) {

                    $scope.managerError = false;
                    $scope.deployments = result.data;

                    _.each($scope.deployments, function (d) {
                        $scope.blueprints[d.blueprint_id] = {
                            'label': d.blueprint_id,
                            'value': d.blueprint_id
                        };
                    });
                    $scope.blueprints = _.values($scope.blueprints);
                    $scope.deploymentsLoaded = true;
                },
                function () {
                    $scope.managerError = true;
                });
        };


        $scope.onExecutionStart = function () {
            _loadExecutions();
        };

        $scope.pluckArrayOfObjects = function (objectsArray, key) {
            var pl = _.pluck(objectsArray, key);
            //console.log($scope.deploymentsFilter, pl);
            return pl;
        };

        $scope.registerTickerTask('deployments/loadExecutions', _loadExecutions, 10000);

        $scope.loadDeployments();


    })
    .filter('customFilter', function($filter) {
        var filterFilter = $filter('filter');
        var standardComparator = function standardComparator(obj, text) {
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        return function customFilter(array, expression) {
            function customComparator(actual, expected) {

                if (!angular.isObject(expected)) {
                    var evaluated;
                    try {
                        evaluated = JSON.parse(expected);
                    }catch(e) {
                        evaluated = expected;
                    }
                    if(typeof evaluated !== 'undefined'){
                        expected = evaluated;
                    }
                }

                if (angular.isObject(expected)) {
                    //exact match
                    if (expected.distinct) {
                        if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                            return false;
                        }

                        return true;
                    }

                    if (!Array.isArray(expected.matchAny)) {
                        expected.matchAny = JSON.parse(expected.matchAny);
                    }

                    //matchAny
                    if (expected.matchAny) {

                        if (!actual) {
                            return false;
                        }

                        if (expected.matchAny.length === 0) {
                            return true;
                        }

                        for (var i = 0; i < expected.matchAny.length; i++) {
                            if (actual.toLowerCase() === expected.matchAny[i].toLowerCase()) {
                                return true;
                            }
                        }

                        return false;
                    }

                    return true;

                }
                return standardComparator(actual, expected);
            }

            var output = filterFilter(array, expression, customComparator);
            return output;
        };
    });
