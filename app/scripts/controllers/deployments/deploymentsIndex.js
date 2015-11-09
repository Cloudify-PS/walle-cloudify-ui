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

        function _loadExecutions() {

            var statusFilter = ['pending', 'started', 'cancelling', 'force_cancelling'];
            return cloudifyClient.executions.list({_include: 'id,workflow_id,status,deployment_id', status: statusFilter}).then(function(result){
                runningExecutions = _.groupBy(result.data, 'deployment_id');
            },function(){
                // todo: implement error handling
            });
        }

        $scope.loadDeployments = function() {
            cloudifyClient.deployments.list('id,blueprint_id,created_at,updated_at,workflows,inputs,outputs')
                .then(function(result) {

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
                function(res) {
                    $scope.managerError = true;
                    if(res.status === 403){
                        $scope.permissionDenied = true;
                    }
                });
        };


        $scope.onExecutionStart = function() {
            _loadExecutions();
        };

        $scope.pluckArrayOfObjects = function (objectsArray, key) {
            return _.pluck(objectsArray, key);
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
                        return !(!actual || actual.toLowerCase() !== expected.distinct.toLowerCase());
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

            return filterFilter(array, expression, customComparator);
        };
    });
