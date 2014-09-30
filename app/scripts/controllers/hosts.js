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
        var _type = 'host';
        var _filter = {};
        var _filterBlueprint = null;
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
            NodeSearchService.execute(_type, _filter, _filterBlueprint)
                .then(function(data){
                    $scope.nodesList = data;
                    $scope.filterLoading = false;
                });
        }

        $scope.getBlueprintId = function() {
            return _filterBlueprint;
        };

        $scope.$watch('eventsFilter.blueprints', function(newValue){
            if(newValue !== null) {
                $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, [newValue]);
                _filterBlueprint = newValue.value;
            }
            else {
                $scope.deploymentsList = [];
                _filterBlueprint = null;
            }
        }, true);

        $scope.$watch('eventsFilter.deployments', function(newValue){
            if(newValue !== null) {
                _filter = {
                    'deployment_id': newValue.value
                };
            } else {
                _filter = {};
            }
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
