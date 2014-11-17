'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, BreadcrumbsService, $filter, NodeSearchService) {

        /**
         * Breadcrumbs
         */
        BreadcrumbsService.push('hosts', {
            href: '#/hosts',
            i18nKey: 'breadcrumb.hosts',
            id: 'hosts'
        });

        /**
         * Hosts
         */
        var _type = 'cloudify.nodes.Compute';
        var _deployments = {};
        var _blueprint = null;
        var _deploymentsList = NodeSearchService.getDeployments();

        $scope.deploymentsList = _deploymentsList;
        $scope.blueprintsList = NodeSearchService.getBlueprints();
        $scope.filterLoading = false;
        $scope.eventsFilter = {
            'blueprints': null,
            'deployments': null
        };

        function _execute() {
            $scope.filterLoading = true;
            NodeSearchService.execute(_type, _blueprint, _deployments)
                .then(function(data){

                    console.log(['NodeSearchService', data]);

                    $scope.nodesList = data;
                    $scope.filterLoading = false;
                });
        }

        $scope.getBlueprintId = function() {
            return _blueprint;
        };

        $scope.$watch('eventsFilter.blueprints', function(newValue){
            if(newValue !== null) {
                $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, [newValue]);
                _blueprint = newValue.value;
            }
            else {
                $scope.deploymentsList = [];
                _blueprint = null;
            }
        }, true);

        $scope.$watch('eventsFilter.deployments', function(newValue){
            _deployments = newValue;
        }, true);

        $scope.execute = function() {
            if (!$scope.isSearchDisabled()) {
                _execute();
            }
        };

        $scope.isSearchDisabled = function() {
            return $scope.eventsFilter.blueprints === null || $scope.eventsFilter.blueprints.length === 0;
        };

    });
